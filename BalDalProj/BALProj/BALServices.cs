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
        public static string GetPetsTable()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetsTable());
        }
        public static string GetActivitiesTable(int category)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetActivitiesTable(category));
        }
        public static string GetVeterianriansTable()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetVeterianriansTable());
        }
        public static string GetRegionsTable()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetRegionsTable());
        }
        public static string GetPetRacesTable(bool isDog)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetRacesTable(isDog));
        }
        public static string GetActivityTypesTable()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetActivityTypesTable());
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
        public static string SavePetImage(string petID, string imgPath)
        {
            Pets p = DBServices.SavePetImage(petID, imgPath);
            return new JavaScriptSerializer().Serialize(p);
        }
        public static string UpdateUser(string userID, string password, string email, string phone, int regionCode)
        {
            return new JavaScriptSerializer().Serialize(DBServices.UpdateUser(userID, password, email, phone, regionCode));
        }

        public static string GetPetsInfo(int isDog, int regionId, bool sortByAge, bool sortByGender)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetsInfo(isDog, regionId, sortByAge, sortByGender));
        }
        public static string GetPetPhoneNumber(string userID)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetPhoneNumber(userID));
        }
    }
}
