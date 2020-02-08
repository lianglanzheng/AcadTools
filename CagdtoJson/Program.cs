using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace CagdtoJson
{
    static class GlobalInfo
    {
        public static Dictionary<string, decimal[]> 地层力学特性 = new Dictionary<string, decimal[]>
        {
            {"1_1", new decimal[] {25, 90 } },
            {"1_1s", new decimal[] {25, 90 } },
            {"1_1y", new decimal[] {25, 90 } },
            {"1_2", new decimal[] {25, 90 } },
            {"1_3", new decimal[] {25, 100 } },
            {"10_1", new decimal[] {55, 200 } },
            {"11_1_1k", new decimal[] {55, 240 } },
            {"11_1_1y", new decimal[] {65, 280 } },
            {"11_2_1k", new decimal[] {55, 240 } },
            {"11_2_1y", new decimal[] {65, 320 } },
            {"12a_11", new decimal[] {80, 350 } },
            {"12a_6", new decimal[] {80, 350 } },
            {"12b_11j", new decimal[] {150, 550 } },
            {"12b_11s", new decimal[] {100, 450 } },
            {"12b_11t", new decimal[] {90, 400 } },
            {"12b_6s", new decimal[] {100, 450 } },
            {"12b_6t", new decimal[] {90, 400 } },
            {"12c_11", new decimal[] {180, 1000 } },
            {"12c_11j", new decimal[] {180, 700 } },
            {"12c_6", new decimal[] {14.4M, 800 } },
            {"12c_6j", new decimal[] {180, 700 } },
            {"12d_11", new decimal[] {270, 1500 } },
            {"12d_6", new decimal[] {270, 1500 } },
            {"13a_11", new decimal[] {80, 350 } },
            {"13a_13", new decimal[] {80, 350 } },
            {"13a_6", new decimal[] {80, 350 } },
            {"13b_11j", new decimal[] {150, 550 } },
            {"13b_11s", new decimal[] {100, 450 } },
            {"13b_11t", new decimal[] {90, 400 } },
            {"13b_13t", new decimal[] {90, 400 } },
            {"13b_6s", new decimal[] {100, 450 } },
            {"13b_6t", new decimal[] {90, 400 } },
            {"13c_11", new decimal[] {180, 1000 } },
            {"13c_11j", new decimal[] {180, 700 } },
            {"13c_6", new decimal[] {14.4M, 800 } },
            {"13c_6j", new decimal[] {180, 700 } },
            {"13d_11", new decimal[] {270, 1500 } },
            {"13d_13", new decimal[] {270, 1500 } },
            {"13d_6", new decimal[] {270, 1500 } },
            {"14a_40", new decimal[] {85, 350 } },
            {"14a_41", new decimal[] {85, 350 } },
            {"14a_9", new decimal[] {85, 350 } },
            {"14b_41j", new decimal[] {150, 800 } },
            {"14b_41s", new decimal[] {120, 500 } },
            {"14b_41t", new decimal[] {110, 450 } },
            {"14b_9s", new decimal[] {100, 450 } },
            {"14b_9t", new decimal[] {90, 400 } },
            {"14c_41", new decimal[] {360, 2000 } },
            {"14c_41j", new decimal[] {180, 1200 } },
            {"14c_9", new decimal[] {180, 1000 } },
            {"14d_41", new decimal[] {720, 4000 } },
            {"15a_40", new decimal[] {85, 350 } },
            {"15b_40j", new decimal[] {180, 700 } },
            {"15b_40s", new decimal[] {120, 500 } },
            {"15b_40t", new decimal[] {110, 450 } },
            {"15c_40", new decimal[] {360, 2000 } },
            {"15c_40j", new decimal[] {180, 1200 } },
            {"15d_40", new decimal[] {720, 4000 } },
            {"2_0", new decimal[] {25, 60 } },
            {"2_1", new decimal[] {45, 160 } },
            {"2_1r", new decimal[] {30, 100 } },
            {"2_2", new decimal[] {40, 200 } },
            {"3_3", new decimal[] {20, 80 } },
            {"3_4", new decimal[] {25, 100 } },
            {"3_5", new decimal[] {35, 150 } },
            {"3_6", new decimal[] {45, 200 } },
            {"3_9", new decimal[] {120, 300 } },
            {"4_0", new decimal[] {25, 60 } },
            {"4_1", new decimal[] {45, 200 } },
            {"4_3", new decimal[] {30, 100 } },
            {"4_4", new decimal[] {30, 110 } },
            {"4-1", new decimal[] {45, 160 } },
            {"5_1", new decimal[] {45, 160 } },
            {"5_1r", new decimal[] {35, 120 } },
            {"6_4", new decimal[] {30, 110 } },
            {"6_5", new decimal[] {35, 160 } },
            {"6_6", new decimal[] {50, 200 } },
            {"6_7", new decimal[] {55, 200 } },
            {"6_9", new decimal[] {120, 300 } }
        };
    }
    class 桩柱钻孔工程集
    {
        public 钻孔集 钻孔集 = new 钻孔集 { };
        public 桩柱集 桩柱集 = new 桩柱集 { };
    }
    class 钻孔集 : Dictionary<string, 钻孔> { }
    class 钻孔
    {
        public decimal 孔口标高;
        public decimal 钻孔深度;
        public string 线别工程名称;
        public List<地层> 地层集 = new List<地层> { };
    }
    class 地层
    {
        public string 地层序号;
        public string 地层编号;
        public string 土类代码;
        public string 土类名称;
        public decimal 换层深度;
        public string 年代成因;
        public string 野外描述;
        public decimal 侧摩阻力标准值;
        public decimal 容许承载力;
    }
    class 桩柱集 : Dictionary<string, 桩柱> { }
    class 桩柱
    {
        public string 备注;
        public string 参考钻孔;
        public decimal 桩径;
        public decimal 桩顶标高;
        public decimal 桩底标高;
        钻孔 施工地质 = new 钻孔();
    }
    class Program
    {
        static public DataSet CagdData;
        [STAThreadAttribute]
        static void Main(string[] args)
        {
            ResetCagdData();
            if (!ImportCagd()) return;
            string JsonStr = GetJson(BuildDataTree());
            Console.WriteLine(Export钻孔集(JsonStr));
        }
        static void ResetCagdData()
        {
            CagdData = new DataSet();
            DataTable tDataTable;
            tDataTable = new DataTable("基本数据表");
            tDataTable.Columns.Add("序号", typeof(System.String));
            tDataTable.Columns.Add("钻孔编号", typeof(System.String));
            tDataTable.Columns.Add("钻孔类型", typeof(System.String));
            tDataTable.Columns.Add("孔口坐标X", typeof(System.String));
            tDataTable.Columns.Add("孔口坐标Y", typeof(System.String));
            tDataTable.Columns.Add("里程桩号", typeof(System.String));
            tDataTable.Columns.Add("孔口标高", typeof(System.String));
            tDataTable.Columns.Add("钻孔深度", typeof(System.String));
            tDataTable.Columns.Add("开工日期", typeof(System.String));
            tDataTable.Columns.Add("完工日期", typeof(System.String));
            tDataTable.Columns.Add("初见水位", typeof(System.String));
            tDataTable.Columns.Add("稳定水位", typeof(System.String));
            tDataTable.Columns.Add("水位观测日期", typeof(System.String));
            tDataTable.Columns.Add("钻孔直径", typeof(System.String));
            tDataTable.Columns.Add("钻孔变径深度", typeof(System.String));
            tDataTable.Columns.Add("套管直径", typeof(System.String));
            tDataTable.Columns.Add("套管深度", typeof(System.String));
            tDataTable.Columns.Add("钻机型号", typeof(System.String));
            tDataTable.Columns.Add("与轴线关系", typeof(System.String));
            tDataTable.Columns.Add("备注", typeof(System.String));
            tDataTable.Columns.Add("线别工程名称", typeof(System.String));
            tDataTable.Columns.Add("勘探单位", typeof(System.String));
            tDataTable.Columns.Add("拟编人", typeof(System.String));
            tDataTable.Columns.Add("验桩附加数据", typeof(System.String));
            tDataTable.Columns.Add("取水样", typeof(System.String));
            CagdData.Tables.Add(tDataTable);
            tDataTable = new DataTable("分层数据表");
            tDataTable.Columns.Add("钻孔编号", typeof(System.String));
            tDataTable.Columns.Add("钻孔类型", typeof(System.String));
            tDataTable.Columns.Add("地层序号", typeof(System.String));
            tDataTable.Columns.Add("地层编号", typeof(System.String));
            tDataTable.Columns.Add("土类代码", typeof(System.String));
            tDataTable.Columns.Add("土类名称", typeof(System.String));
            tDataTable.Columns.Add("换层深度", typeof(System.String));
            tDataTable.Columns.Add("年代成因", typeof(System.String));
            tDataTable.Columns.Add("岩心采取率", typeof(System.String));
            tDataTable.Columns.Add("野外描述", typeof(System.String));
            tDataTable.Columns.Add("备注", typeof(System.String));
            tDataTable.Columns.Add("备用", typeof(System.String));
            tDataTable.Columns.Add("容许承载力", typeof(System.String));
            tDataTable.Columns.Add("极限摩阻力", typeof(System.String));
            tDataTable.Columns.Add("单桩Qsia", typeof(System.String));
            tDataTable.Columns.Add("单桩Qpa", typeof(System.String));
            tDataTable.Columns.Add("单桩进入深度", typeof(System.String));
            tDataTable.Columns.Add("岩层倾向", typeof(System.String));
            tDataTable.Columns.Add("岩层倾角", typeof(System.String));
            tDataTable.Columns.Add("地基承载力特征值", typeof(System.String));
            tDataTable.Columns.Add("钻孔灌注桩桩的极限标准值", typeof(System.String));
            tDataTable.Columns.Add("钻孔灌注桩桩的极限端阻力标准值", typeof(System.String));
            tDataTable.Columns.Add("预制桩桩的极限标准值", typeof(System.String));
            tDataTable.Columns.Add("预制桩桩的极限端阻力标准值", typeof(System.String));
            tDataTable.Columns.Add("搅拌桩桩周土的侧阻力特征值", typeof(System.String));
            CagdData.Tables.Add(tDataTable);

        }
        static bool ImportCagd()
        {
            OpenFileDialog iOFD = new OpenFileDialog();
            iOFD.Title = "导入Cagd钻孔数据";
            iOFD.Filter = "Cagd钻孔数据（*.mdb）|*.mdb|All files(*.*)|*.*";
            iOFD.RestoreDirectory = true;
            if (iOFD.ShowDialog() == DialogResult.OK)
            {
                OleDbConnection iDbConn = new OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + iOFD.FileName + ";Persist Security Info=False");
                OleDbDataAdapter iDbAdp;
                iDbAdp = new OleDbDataAdapter("SELECT 序号,钻孔编号,钻孔类型,孔口坐标X,孔口坐标Y,里程桩号,孔口标高,钻孔深度,开工日期,完工日期,初见水位,稳定水位,水位观测日期,钻孔直径,钻孔变径深度,套管直径,套管深度,钻机型号,与轴线关系,备注,线别工程名称,勘探单位,拟编人,验桩附加数据,取水样 FROM 基本数据表", iDbConn);
                iDbAdp.Fill(CagdData, "基本数据表");
                iDbAdp = new OleDbDataAdapter("SELECT 钻孔编号,钻孔类型,地层序号,地层编号,土类代码,土类名称,换层深度,年代成因,岩心采取率,野外描述,备注,备用,容许承载力,极限摩阻力,单桩Qsia,单桩Qpa,单桩进入深度,岩层倾向,岩层倾角,地基承载力特征值,钻孔灌注桩桩的极限标准值,钻孔灌注桩桩的极限端阻力标准值,预制桩桩的极限标准值,预制桩桩的极限端阻力标准值,搅拌桩桩周土的侧阻力特征值 FROM 分层数据表", iDbConn);
                iDbAdp.Fill(CagdData, "分层数据表");
                return true;
            }
            return false;
        }
        static bool Export钻孔集(string StrToWrite)
        {
            SaveFileDialog iSFD = new SaveFileDialog();
            iSFD.Title = "钻孔集导出为";
            iSFD.Filter = "JavaScript Object Notation（*.json）|*.json";
            iSFD.RestoreDirectory = true;
            if (iSFD.ShowDialog() == DialogResult.OK)
            {
                StreamWriter iSR = new StreamWriter(iSFD.FileName, false, new System.Text.UTF8Encoding(false));
                iSR.Write(StrToWrite);
                iSR.Close();
                return true;
            }
            return false;
        }
        static 桩柱钻孔工程集 BuildDataTree()
        {
            钻孔集 i钻孔集 = new 钻孔集 { };
            foreach (DataRow i基本 in CagdData.Tables["基本数据表"].Rows)
            {
                string i钻孔编号 = toStr(i基本["钻孔编号"]);
                钻孔 i钻孔 = new 钻孔();
                i钻孔.孔口标高 = toNum(i基本["孔口标高"]);
                i钻孔.钻孔深度 = toNum(i基本["钻孔深度"]);
                i钻孔.线别工程名称 = toStr(i基本["线别工程名称"]);
                foreach (DataRow i分层 in CagdData.Tables["分层数据表"].Select("钻孔编号 = \'" + i钻孔编号 + "\'"))
                {
                    地层 i地层 = new 地层();
                    i地层.地层序号 = toStr(i分层["地层序号"]);
                    i地层.地层编号 = toStr(i分层["地层编号"]);
                    i地层.土类代码 = toStr(i分层["土类代码"]);
                    i地层.土类名称 = toStr(i分层["土类名称"]);
                    i地层.换层深度 = toNum(i分层["换层深度"]);
                    i地层.年代成因 = toStr(i分层["年代成因"]);
                    i地层.野外描述 = toStr(i分层["野外描述"]);
                    if (GlobalInfo.地层力学特性.ContainsKey(i地层.地层编号))
                    {
                        i地层.侧摩阻力标准值 = GlobalInfo.地层力学特性[i地层.地层编号][0];
                        i地层.容许承载力 = GlobalInfo.地层力学特性[i地层.地层编号][1];
                    }
                    i钻孔.地层集.Add(i地层);
                }
                i钻孔.地层集 = i钻孔.地层集.OrderBy(x => long.Parse(x.地层序号)).ToList();
                i钻孔集.Add(i钻孔编号 , i钻孔);
            }
            桩柱钻孔工程集 i桩柱钻孔工程集 = new 桩柱钻孔工程集();
            i桩柱钻孔工程集.钻孔集 = i钻孔集;
            return i桩柱钻孔工程集;
        }
        static string GetJson(桩柱钻孔工程集 input)
        {
            JavaScriptSerializer JSSerializer = new JavaScriptSerializer();
            string JsonStr = JSSerializer.Serialize(input);
            return JsonStr;
        }
        static decimal toNum(object obj)
        {
            decimal num;
            if (obj.GetType() != typeof(DBNull))
            {
                string str = (string)obj;
                if (decimal.TryParse(str, out num)) return num;
                else return 0;
            }
            else return 0;
        }
        static string toStr(object obj)
        {
            if (obj.GetType() != typeof(DBNull)) return obj.ToString();
            else return "";
        }
    }
}
