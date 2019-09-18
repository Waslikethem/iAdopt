

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Reflection;
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

        //שליפת הטבלה של החיות מחמד
        public static List<Pets> GetPetsDetails()
        {
            List<Pets> pets = new List<Pets>();
            Pets p = null;
            comm.CommandText = $"SELECT * FROM PetDetails where DueDate > getdate()";
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
                    Image = reader["Image"].ToString(),
                };
                pets.Add(p);
            }
            comm.Connection.Close();
            return pets;
        }
        //שליפת הטבלה של הוטרינרים
        public static List<Veterianrians> GetVeterianriansDetails()
        {
            List<Veterianrians> vets = new List<Veterianrians>();
            Veterianrians v = null;
            comm.CommandText = $"SELECT * FROM Veterianrians";
            comm.Connection.Open();
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                v = new Veterianrians()
                {
                    VeterianrianID = int.Parse(reader["VeterianrianID"].ToString()),
                    ClinicName = reader["ClinicName"].ToString(),
                    RegionCode = int.Parse(reader["RegionCode"].ToString()),
                    Address = reader["Address"].ToString(),
                    VeterianrianName = reader["VeterianrianName"].ToString(),
                    Phone = reader["Phone"].ToString()
                };
                vets.Add(v);
            }
            comm.Connection.Close();
            return vets;
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
                    comm.CommandText = $"INSERT INTO Users(UserName,Password,Email,Fname,Lname,Phone,RegionCode,Gender,UserImage)VALUES('{userName}','{password}','{email}','{fName}','{lName}','{phone}',{regionCode},'{gender}','')";
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

                };
            }
            comm.Connection.Close();
            return u;
        }
        //העלאת תמונה
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
    }
}



