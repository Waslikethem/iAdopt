

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Reflection;
using System.Web;
using System.Web.Script.Serialization;

namespace DALProj
{
    public static class DBServices
    {
        static string conStr = null;
        static bool local = true;
        static SqlConnection conn = null;
        static SqlCommand comm = null;
        static DBServices()
        {
            Configuration config = null;
            string codeBase = Assembly.GetExecutingAssembly().CodeBase;
            UriBuilder uri = new UriBuilder(codeBase);
            string path = Uri.UnescapeDataString(uri.Path); //Looking For the DLLs
            string exeConfigPath = path;
            try
            {
                config = ConfigurationManager.OpenExeConfiguration(exeConfigPath);
            }
            catch (Exception e)
            {
                //Handle Errors
            }
            if (config != null)
            {
                conStr = GetAppSetting(config, local ? "Local" : "LiveDNS");
            }
            conn = new SqlConnection(conStr);
            comm = new SqlCommand();
            comm.Connection = conn;
        }
        static string GetAppSetting(Configuration config, string key)
        {
            KeyValueConfigurationElement element = config.AppSettings.Settings[key];
            if (element != null)
            {
                string value = element.Value;
                if (!string.IsNullOrEmpty(value))
                {
                    return value;
                }
            }
            return string.Empty;
        }
        //שליפת טבלת חיות המחמד - שי אברהם
        public static List<Pets> GetPetsInfo(int isDog, int regionId, bool sortByAge, bool sortByGender)
        {
            List<Pets> pets = new List<Pets>();
            Pets p = null;
            string sql = "Exec GetPetsInfo ";
            sql += (isDog != -1) ? $"'where IsDog = {isDog} " : "";
            if (regionId != 0)
            {
                sql += (isDog != -1) ? $"and RegionID = {regionId}', " : $"'where RegionID = {regionId}', ";
            }
            else
            {
                sql += (isDog != -1) ? $"', " : $"NULL, ";
            }

            sql += (sortByAge) ? "'order by Age" : "";

            if (sortByGender)
            {
                sql += (!sortByAge) ? "'order by Gender'" : ", Gender'";
            }
            else
            {
                sql += (sortByAge) ? "'" : "NULL";
            }
            comm.CommandText = sql;
            comm.Connection.Close();
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                p = new Pets()
                {
                    PetID = int.Parse(reader["PetID"].ToString()),
                    Name = reader["Name"].ToString(),
                    Age = int.Parse(reader["Age"].ToString()),
                    RaceCode = int.Parse(reader["RaceCode"].ToString()),
                    IsDog = bool.Parse(reader["IsDog"].ToString()),
                    UserCode = int.Parse(reader["UserCode"].ToString()),
                    Gender = char.Parse(reader["Gender"].ToString()),
                    Vaccines = reader["Vaccines"].ToString(),
                    RegionID = int.Parse(reader["RegionID"].ToString()),
                    Gallery = new List<string>()
                };
                pets.Add(p);
            }
            for (int i = 0; i < pets.Count; i++)
            {
                string path = HttpContext.Current.Server.MapPath("~/ImageStorage/Pets/" + pets[i].PetID.ToString());
                string[] files = (Directory.Exists(path)) ? Directory.GetFiles(path) : new string[0];
                foreach (string file in files)
                {
                    pets[i].Gallery.Add(Path.GetFileName(file));
                }
            }

            comm.Connection.Close();
            return pets;
        }
        //שליפת נתוני חיה מהטבלה
        public static Pets GetPetDetails(int petID)
        {
            Pets p = null;
            comm.CommandText = $"SELECT * FROM PetDetails WHERE PetID='{petID}'";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            if (reader.Read())
            {
                p = new Pets()
                {
                    PetID = int.Parse(reader["PetID"].ToString()),
                    Name = reader["Name"].ToString(),
                    Age = int.Parse(reader["Age"].ToString()),
                    RaceCode = int.Parse(reader["RaceCode"].ToString()),
                    IsDog = bool.Parse(reader["IsDog"].ToString()),
                    UserCode = int.Parse(reader["UserCode"].ToString()),
                    Gender = char.Parse(reader["Gender"].ToString()),
                    Vaccines = reader["Vaccines"].ToString(),
                    Gallery = new List<string>()
                };
            }
            string path = HttpContext.Current.Server.MapPath("~/ImageStorage/Pets/" + p.PetID.ToString());
            string[] files = (Directory.Exists(path)) ? Directory.GetFiles(path) : new string[0];
            foreach (string file in files)
            {
                p.Gallery.Add(Path.GetFileName(file));
            }
            comm.Connection.Close();
            return p;
        }
        //שליפת שם אזור לפי מפתח
        public static string GetPetRace(int raceCode)
        {
            Races r = null;
            comm.CommandText = $"SELECT * FROM PetRaces Where (RaceID='{raceCode}')";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            if (reader.Read())
            {
                r = new Races()
                {
                    RaceName = reader["RaceName"].ToString(),
                };
            }
            comm.Connection.Close();
            return r.RaceName;
        }
        //שליפת מס הפלאפון של בעל החיה
        public static string GetOwnerPhoneNumber(string userID)
        {
            User u = null;
            comm.CommandText = $"SELECT Phone FROM Users Where (UserID='{userID}')";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            if (reader.Read())
            {
                u = new User()
                {
                    Phone = reader["Phone"].ToString(),
                };
            }
            comm.Connection.Close();
            return u.Phone;
        }
        //שליפת טבלת גזעי החיות מחמד
        public static List<PetRaces> GetPetRacesTable(bool isDog)
        {
            if (isDog)
            {
                List<PetRaces> petRaces = new List<PetRaces>();
                PetRaces pR = null;
                comm.CommandText = $"SELECT * FROM PetRaces Where isDog=1";
                comm.Connection.Open();
                SqlDataReader reader = comm.ExecuteReader();
                while (reader.Read())
                {
                    pR = new PetRaces()
                    {
                        value = int.Parse(reader["RaceID"].ToString()),
                        label = reader["RaceName"].ToString(),
                    };
                    petRaces.Add(pR);
                }
                comm.Connection.Close();
                return petRaces;
            }
            else
            {
                List<PetRaces> petRaces = new List<PetRaces>();
                PetRaces pR = null;
                comm.CommandText = $"SELECT * FROM PetRaces Where isDog=0";
                comm.Connection.Open();
                SqlDataReader reader = comm.ExecuteReader();
                while (reader.Read())
                {
                    pR = new PetRaces()
                    {
                        value = int.Parse(reader["RaceID"].ToString()),
                        label = reader["RaceName"].ToString(),
                    };
                    petRaces.Add(pR);
                }
                comm.Connection.Close();
                return petRaces;
            }
        }
        //שליפת טבלת סוג הפעילויות
        public static List<ActivityTypes> GetActivityTypesTable()
        {
            List<ActivityTypes> activity = new List<ActivityTypes>();
            ActivityTypes a = null;
            comm.CommandText = $"SELECT * FROM ActivityType";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                a = new ActivityTypes()
                {
                    ActivityID = int.Parse(reader["ActivityID"].ToString()),
                    ActivityType = reader["ActivityType"].ToString(),
                };
                activity.Add(a);
            }
            comm.Connection.Close();
            return activity;
        }
        //שליפת טבלת הפעילויות
        public static List<Activities> GetActivitiesTable(int category)
        {
            if (category == -1)
            {
                List<Activities> activities = new List<Activities>();
                Activities a = null;
                comm.CommandText = $"SELECT * FROM Activities";
                comm.Connection.Open();
                SqlDataReader reader = comm.ExecuteReader();
                while (reader.Read())
                {
                    a = new Activities()
                    {
                        ID = int.Parse(reader["ID"].ToString()),
                        Name = reader["Name"].ToString(),
                        RegionCode = int.Parse(reader["RegionCode"].ToString()),
                        ActivityCode = int.Parse(reader["ActivityCode"].ToString()),
                        DueDate = reader["DueDate"].ToString(),
                        Description = reader["Description"].ToString()
                    };
                    activities.Add(a);
                }
                comm.Connection.Close();
                return activities;
            }
            else
            {
                List<Activities> activities = new List<Activities>();
                Activities a = null;
                comm.CommandText = $"SELECT * FROM Activities WHERE ActivityCode = {category}";
                comm.Connection.Open();
                SqlDataReader reader = comm.ExecuteReader();
                while (reader.Read())
                {
                    a = new Activities()
                    {
                        ID = int.Parse(reader["ID"].ToString()),
                        Name = reader["Name"].ToString(),
                        RegionCode = int.Parse(reader["RegionCode"].ToString()),
                        ActivityCode = int.Parse(reader["ActivityCode"].ToString()),
                        DueDate = reader["DueDate"].ToString(),
                        Description = reader["Description"].ToString()
                    };
                    activities.Add(a);
                }
                comm.Connection.Close();
                return activities;
            }
        }
        //שליפת ערכים ספציפים מטבלת קטגוריות לפי מס קטגוריה
        public static List<Categories> GetCategoryTable(int CatID)
        {
            List<Categories> cats = new List<Categories>();
            Categories c = null;
            switch (CatID)
            {
                case 1:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=1";
                    break;
                case 2:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=2";
                    break;
                case 3:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=3";
                    break;
                case 4:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=4";
                    break;
                case 5:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=5";
                    break;
                case 6:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=6";
                    break;
                case 7:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=7";
                    break;
                case 8:
                    comm.CommandText = $"SELECT * FROM Categories Where CategoryCode=8";
                    break;
            }
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                c = new Categories()
                {
                    ID = int.Parse(reader["ID"].ToString()),
                    Name = reader["Name"].ToString(),
                    RegionCode = int.Parse(reader["RegionCode"].ToString()),
                    CategoryCode = int.Parse(reader["CategoryCode"].ToString()),
                    Description = reader["Description"].ToString(),
                    Phone = reader["Phone"].ToString(),
                    Address = reader["Address"].ToString(),
                };
                cats.Add(c);
            }
            comm.Connection.Close();
            return cats;
        }
        //שליפת טבלת האזורים בארץ
        public static List<Regions> GetRegionsTable()
        {
            List<Regions> regions = new List<Regions>();
            Regions r = null;
            comm.CommandText = $"SELECT * FROM Regions";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                r = new Regions()
                {
                    value = int.Parse(reader["RegionID"].ToString()),
                    label = reader["RegionName"].ToString(),
                };
                regions.Add(r);
            }
            comm.Connection.Close();
            return regions;
        }
        //הרשמה של משתמש אל האפליקציה
        public static User Registration(string userName, string password, string email, string fName, string lName, string phone, int regionCode, string gender)
        {
            User u = null;
            SqlDataReader reader = null;
            //SqlDataReader reader2 = null;
            try
            {
                comm.CommandText = $"SELECT * FROM Users WHERE Email ='{email}'";
                comm.Connection.Open();
                reader = comm.ExecuteReader();
                if (reader.Read())
                {
                    return u;
                }
                else
                {
                    if (!reader.IsClosed)
                        reader.Close();
                    comm.CommandText = $"INSERT INTO Users(UserName,Password,Email,Fname,Lname,Phone,RegionCode,Gender,UserImage)VALUES" +
                    $"('{userName}','{password}','{email}','{fName}','{lName}','{phone}',{regionCode},'{gender}','')";
                    int res = comm.ExecuteNonQuery();
                    if (res == 1)
                    {
                        comm.CommandText = "SELECT max(UserID) as maxID FROM Users";
                        reader = comm.ExecuteReader();
                        if (reader.Read())
                        {
                            u = new User()
                            {
                                UserID = (int)reader["maxID"],
                                UserName = userName,
                                Password = password,
                                Email = email,
                                Fname = fName,
                                Lname = lName,
                                Phone = phone,
                                RegionCode = regionCode,
                                Gender = gender
                            };
                        }
                        return u;
                    }

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                if (!reader.IsClosed)
                    reader.Close();
                if (comm.Connection.State != ConnectionState.Closed)
                {
                    comm.Connection.Close();
                }

            }

            return u;
        }
        //התחברות משתמש אל האפליקציה
        public static User Login(string userNameOrEmail, string userPass)
        {
            User u = null;
            comm.CommandText = $"SELECT * " + " " +
                $" FROM Users " + " " +
                $" WHERE (UserName='{userNameOrEmail}' OR Email='{userNameOrEmail}') AND Password='{userPass}' ";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            if (reader.Read())
            {
                u = new User()
                {
                    UserID = int.Parse(reader["UserID"].ToString()),
                    UserName = reader["UserName"].ToString(),
                    Password = (string)reader["Password"],
                    Email = reader["Email"].ToString(),
                    Phone = reader["Phone"].ToString(),
                    RegionCode = int.Parse(reader["RegionCode"].ToString()),
                    Fname = reader["Fname"].ToString(),
                    Lname = reader["Lname"].ToString(),
                    Gender = reader["Gender"].ToString(),
                    UserImage = reader["UserImage"].ToString()
                };
            }
            comm.Connection.Close();
            return u;
        }
        //העלאת תמונת משתמש
        public static User SaveUserImage(string userID, string imgPath)
        {
            User u = null;
            comm.CommandText = $"UPDATE Users" +
                   $" SET UserImage='{imgPath}' WHERE UserID='{int.Parse(userID)}'";
            comm.Connection.Open();
            int res = comm.ExecuteNonQuery();
            if (res == 1)
            {
                u = new User()
                {
                    UserID = int.Parse(userID),
                    UserImage = imgPath
                };
            }
            comm.Connection.Close();
            return u;
        }
        //העלאת תמונת חיית מחמד
        public static Pets SavePetImage(string petID, string imgPath)
        {
            Pets p = null;
            comm.CommandText = $"UPDATE PetDetails" +
                   $" SET Image='{imgPath}' WHERE PetID='{int.Parse(petID)}'";
            comm.Connection.Open();
            int res = comm.ExecuteNonQuery();
            if (res == 1)
            {
                p = new Pets()
                {
                    PetID = int.Parse(petID),
                    Image = imgPath
                };
            }
            comm.Connection.Close();
            return p;
        }
        //עידכון משתמש
        public static User UpdateUser(string userID, string password, string email, string phone, int regionCode)
        {
            User u = null;
            comm.CommandText = $"UPDATE Users" +
                   $" SET Password='{password}' ,Email='{email}',Phone='{phone}',RegionCode='{regionCode}'WHERE UserID='{userID}'";
            comm.Connection.Open();
            int res = comm.ExecuteNonQuery();
            if (res == 1)
            {
                u = new User()
                {
                    UserID = int.Parse(userID),
                    Password = password,
                    Email = email,
                    Phone = phone,
                    RegionCode = regionCode,

                };
            }
            comm.Connection.Close();
            return u;

        }
        public static List<CategoryTypes> GetCategoriesTypes()
        {
            List<CategoryTypes> categories = new List<CategoryTypes>();
            CategoryTypes category = null;
            comm.CommandText = $"SELECT * FROM CategoryType";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                category = new CategoryTypes()
                {
                    MiscID = int.Parse(reader["MiscID"].ToString()),
                    MiscName = reader["MiscName"].ToString(),
                    CategoryImage = "Category/" + int.Parse(reader["MiscID"].ToString()) + "/1.jpg"
                };
                categories.Add(category);
            }
            comm.Connection.Close();
            return categories;
        }
        //שליפת פרטי קטגוריה
        public static Categories GetCategoryDetails(int key)
        {
            Categories c = null;
            comm.CommandText = $"SELECT * FROM Categories Where (ID='{key}')";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            if (reader.Read())
            {
                c = new Categories()
                {
                    Name = reader["Name"].ToString(),
                    Description = reader["Description"].ToString(),
                    Phone = reader["Phone"].ToString(),
                    Address = reader["Address"].ToString(),
                    CategoryCode = int.Parse(reader["CategoryCode"].ToString()),
                    Gallery = new List<string>(),
                    ID = int.Parse(reader["ID"].ToString()),
                    RegionCode = int.Parse(reader["RegionCode"].ToString())
                };
            }
            string path = HttpContext.Current.Server.MapPath("~/ImageStorage/Category/" + c.CategoryCode + @"/" + key.ToString());
            string[] files = (Directory.Exists(path)) ? Directory.GetFiles(path) : new string[0];
            foreach (string file in files)
            {
                c.Gallery.Add(Path.GetFileName(file));
            }
            comm.Connection.Close();
            return c;
        }
    }
}



