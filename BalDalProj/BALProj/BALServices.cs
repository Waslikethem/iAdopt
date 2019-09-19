using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using DALProj;

namespace BALProj
{
    public static class BALServices
    {
        public static string Login(string userNameOrEmail, string userPass)
        {
            User u = DBServices.Login(userNameOrEmail, userPass);
            return new JavaScriptSerializer().Serialize(u);
        }
        public static string GetPetsDetails()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetsDetails());
        }
        public static string GetVeterianriansDetails()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetVeterianriansDetails());
        }
        public static string GetRegionsTable()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetRegionsTable());
        }
        public static string Registration(string userName, string password, string email, string fName, string lName, string phone, int regionCode, string gender)
        {
            User u = DBServices.Registration(userName, password, email, fName, lName, phone, regionCode, gender);
            return new JavaScriptSerializer().Serialize(u);
        }
        public static string SaveUserImage(string userID, string imgPath)
        {
            User u = DBServices.SaveUserImage(userID, imgPath);
            return new JavaScriptSerializer().Serialize(u);
        }
    }
}
