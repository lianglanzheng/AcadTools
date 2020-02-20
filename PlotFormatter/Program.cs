using System;
using System.Collections.Generic;
using System.Linq;
using AutoCAD;

namespace PlotFormatter
{
    static class GlobalInfo
    {
        public static string TempLayoutName { get; } = "PlotFormatter_TempLayout";
        public static string FrameEffectiveName { get; } = "广东省院图框";
        public static ulong FramePageAttrID { get; } = 10;
        public static double PlotPageWidth { get; } = 420;
        public static double PlotPageHeight { get; } = 297;
        public static string PlotConfigName { get; } = "PDF (A3).pc3";
        public static string PlotCanonicalMediaName { get; } = "UserDefinedMetric (420.00 x 297.00毫米)";
        public static string ModelConfigName { get; } = "无";
    }
    class FormatTask
    {
        private AcadApplication AcadApp;
        public string Filename { get; }
        public string StyleSheetName { get; }
        public bool IsOpenError { get; private set; } = true;
        public bool IsSaveError { get; private set; } = true;
        public struct FrameView
        {
            public int Id;
            public string Page;
            public double[] LowerLeft;
            public double[] UpperRight;
        }
        public Dictionary<string, FrameView> FrameViewList { get; private set; } = new Dictionary<string, FrameView> { };
        public FormatTask(AcadApplication input_AcadApp, string input_Filename, string input_StyleSheetName)
        {
            AcadApp = input_AcadApp;
            Filename = input_Filename;
            StyleSheetName = input_StyleSheetName;
        }
        public void Run()
        {
            try
            {
                AcadApp.EndOpen += AcadApp_EndOpen;
                AcadApp.Documents.Open(Filename);
            }
            catch { }
        }
        public void AcadApp_EndOpen(string filename)
        {
            IsOpenError = false;
            DelLayouts();
            AcadApp.ActiveDocument.ActiveLayout = AcadApp.ActiveDocument.Layouts.Item("Model");
            int tN = AcadApp.ActiveDocument.ModelSpace.Count;
            for (int i = 0; i < tN; i++)
            {
                if (AcadApp.ActiveDocument.ModelSpace.Item(i).EntityName == "AcDbBlockReference")
                {
                    AcadBlockReference iBlockReference = (AcadBlockReference)AcadApp.ActiveDocument.ModelSpace.Item(i);
                    if (iBlockReference.EffectiveName == GlobalInfo.FrameEffectiveName)
                    {
                        string iFVKey;
                        FrameView iFrameView;
                        iFVKey = String.Format("{0, 3}", iBlockReference.GetAttributes()[GlobalInfo.FramePageAttrID].TextString);
                        iFrameView.Id = i;
                        iFrameView.Page = iBlockReference.GetAttributes()[GlobalInfo.FramePageAttrID].TextString;
                        iFrameView.LowerLeft = new double[] { iBlockReference.InsertionPoint[0] - iBlockReference.XScaleFactor * GlobalInfo.PlotPageWidth, iBlockReference.InsertionPoint[1], 0 };
                        iFrameView.UpperRight = new double[] { iBlockReference.InsertionPoint[0], iBlockReference.InsertionPoint[1] + iBlockReference.YScaleFactor * GlobalInfo.PlotPageHeight, 0 };
                        if (!FrameViewList.ContainsKey(iFVKey)) FrameViewList.Add(iFVKey, iFrameView);
                    }
                }
            }
            FrameViewList = FrameViewList.OrderBy(o => o.Key).ToDictionary(o => o.Key, p => p.Value);
            AcadApp.ActiveDocument.Layouts.Item("Model").ConfigName = GlobalInfo.ModelConfigName;
            AcadApp.ActiveDocument.Layouts.Item("Model").StyleSheet = StyleSheetName;
            foreach (KeyValuePair<string, FormatTask.FrameView> iFrameView in FrameViewList)
            {
                AddBlankLayout(iFrameView.Value.Page);
                AcadLayout iLayout = AcadApp.ActiveDocument.Layouts.Item(iFrameView.Value.Page);
                AcadApp.ActiveDocument.ActiveLayout = iLayout;
                iLayout.ConfigName = GlobalInfo.PlotConfigName;
                iLayout.CanonicalMediaName = GlobalInfo.PlotCanonicalMediaName;
                iLayout.PlotRotation = AcPlotRotation.ac0degrees;
                iLayout.PaperUnits = AcPlotPaperUnits.acMillimeters;
                iLayout.SetWindowToPlot(new double[] { 0, 0 }, new double[] { GlobalInfo.PlotPageWidth, GlobalInfo.PlotPageHeight });
                iLayout.PlotType = AcPlotType.acWindow;
                iLayout.UseStandardScale = true;
                iLayout.StandardScale = AcPlotScale.ac1_1;
                iLayout.CenterPlot = true;
                iLayout.StyleSheet = StyleSheetName;
                AcadPViewport iPViewport = AcadApp.ActiveDocument.PaperSpace.AddPViewport(new double[] { GlobalInfo.PlotPageWidth / 2, GlobalInfo.PlotPageHeight / 2, 0 }, GlobalInfo.PlotPageWidth, GlobalInfo.PlotPageHeight);
                iPViewport.Display(true);
                iPViewport.Layer = "0";
                iPViewport.ViewportOn = true;
                AcadApp.ActiveDocument.MSpace = true;
                AcadApp.ActiveDocument.ActivePViewport = iPViewport;
                AcadApp.ZoomWindow(iFrameView.Value.LowerLeft, iFrameView.Value.UpperRight);
                AcadApp.ActiveDocument.MSpace = false;
                iPViewport.DisplayLocked = true;
            }
            AcadApp.ActiveDocument.ActiveLayout = AcadApp.ActiveDocument.Layouts.Item("Model");
            foreach (KeyValuePair<string, FormatTask.FrameView> iFrameView in FrameViewList)
            {
                AcadLayout iLayout = AcadApp.ActiveDocument.Layouts.Item(iFrameView.Value.Page);
                AcadApp.ActiveDocument.ActiveLayout = iLayout;
                AcadApp.ZoomAll();
            }
            DelLayout(GlobalInfo.TempLayoutName);
            AcadApp.ActiveDocument.ActiveLayout = AcadApp.ActiveDocument.Layouts.Item("Model");
            AcadApp.ZoomAll();
            IsSaveError = !SaveDocument();
            AcadApp.ActiveDocument.SendCommand("CLOSE\n");
        }
        private void DelLayout(string Name)
        {
            try
            {
                AcadApp.ActiveDocument.Layouts.Item(Name).Delete();
            }
            catch { }
        }
        private void AddBlankLayout(string Name)
        {
            DelLayout(Name);
            AcadApp.ActiveDocument.Layouts.Add(Name);
            AcadApp.ActiveDocument.ActiveLayout = AcadApp.ActiveDocument.Layouts.Item(Name);
            int tN = AcadApp.ActiveDocument.PaperSpace.Count;
            for (int i = 0; i < tN; i++) AcadApp.ActiveDocument.PaperSpace.Item(0).Delete();
        }
        private void DelLayouts()
        {
            AddBlankLayout(GlobalInfo.TempLayoutName);
            foreach (AcadLayout i in AcadApp.ActiveDocument.Layouts)
            {
                if (i.Name != "Model" && i.Name != GlobalInfo.TempLayoutName) i.Delete();
            }
        }
        private bool SaveDocument()
        {
            try
            {
                AcadApp.ActiveDocument.Save();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
    class Program
    {
        static Dictionary<string, string> ArgsFlag = new Dictionary<string, string>
        {
            {"-13", "ZGHDI-2019-0.13.ctb"},
            {"-13red", "ZGHDI-2019-0.13红粗.ctb"},
            {"-13green", "ZGHDI-2019-0.13绿粗.ctb"},
            {"-13cyan", "ZGHDI-2019-0.13青粗.ctb"},
            {"-18", "ZGHDI-2019-0.18.ctb"},
            {"-18red", "ZGHDI-2019-0.18红粗.ctb"},
            {"-18green", "ZGHDI-2019-0.18绿粗.ctb"},
            {"-18cyan", "ZGHDI-2019-0.18青粗.ctb"},
            {"-20", "ZGHDI-2019-0.20.ctb"},
            {"-20red", "ZGHDI-2019-0.20红粗.ctb"},
            {"-20green", "ZGHDI-2019-0.20绿粗.ctb"},
            {"-20cyan", "ZGHDI-2019-0.20青粗.ctb"}
        };
        static void Main(string[] args)
        {
            Console.WriteLine("PlotFormatter 1.0");
            if (args.Length == 0) foreach (KeyValuePair<string, string> iFlag in ArgsFlag) Console.WriteLine(" " + String.Format("{0,-8}", iFlag.Key) + " " + iFlag.Value);
            else
            {
                Console.WriteLine("Message : Openning AutoCAD application...");
                if (RunAutoCAD())
                {
                    foreach (string iArg in args)
                    {
                        if (!SetStyleSheetName(iArg))
                        {
                            FormatTask iTask = new FormatTask(AcadApp, iArg, StyleSheetName);
                            Console.WriteLine(">>> " + iArg + " [" + StyleSheetName + "]");
                            iTask.Run();
                            foreach (KeyValuePair<string, FormatTask.FrameView> iFrameView in iTask.FrameViewList) Console.WriteLine("  | " + iFrameView.Key + " " + iFrameView.Value.LowerLeft[0] + "," + iFrameView.Value.LowerLeft[1] + " " + iFrameView.Value.UpperRight[0] + "," + iFrameView.Value.UpperRight[1]);
                            if (iTask.IsOpenError) Console.WriteLine("  | " + "Error : Open document failed.");
                            if (iTask.IsSaveError) Console.WriteLine("  | " + "Error : Save document failed.");
                        }
                    }
                    Console.WriteLine("Message : Quitting AutoCAD application...");
                    if (!QuitAutoCAD()) Console.WriteLine("Error : Quit AutoCAD application failed.");
                }
                else Console.WriteLine("Error : Open AutoCAD application failed.");
            }
            Console.WriteLine("Done.");
        }
        static AcadApplication AcadApp;
        static string StyleSheetName = "ZGHDI-2019-0.18.ctb";
        static bool RunAutoCAD()
        {
            try
            {
                AcadApp = new AcadApplication();
                AcadApp.Visible = true;
                AcadApp.WindowState = AcWindowState.acMin;
                return true;
            }
            catch
            {
                return false;
            }
        }
        static bool QuitAutoCAD()
        {
            try
            {
                AcadApp.Quit();
                return true;
            }
            catch
            {
                return false;
            }
        }
        static bool SetStyleSheetName(string flag)
        {
            if (ArgsFlag.ContainsKey(flag))
            {
                StyleSheetName = ArgsFlag[flag];
                return true;
            }
            else return false;
        }
    }
}
