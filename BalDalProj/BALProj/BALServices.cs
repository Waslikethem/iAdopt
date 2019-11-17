using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using DALProj;

namespace BALProj
{
    public static class BALServices
    {
        public static string DeletePet(int pet_id)
        {
            return new JavaScriptSerializer().Serialize(DBServices.DeletePet(pet_id));

        }
        public static string GetCategoryTable(int CatID)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetCategoryTable(CatID));
        }
        public static string ShowMyPets(int user_id)
        {
            return new JavaScriptSerializer().Serialize(DBServices.ShowMyPets(user_id));
        }
        public static string Login(string userNameOrEmail, string userPass)
        {
            User u = DBServices.Login(userNameOrEmail, userPass);
            return new JavaScriptSerializer().Serialize(u);
        }
        public static string GetRegionsTable()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetRegionsTable());
        }
        public static string GetPetRacesTable(bool isDog)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetRacesTable(isDog));
        }
        public static string Registration(string userName, string password, string email, string fName, string lName, string phone, int regionCode, string gender, string userImage = "")
        {
            User u = DBServices.Registration(userName, password, email, fName, lName, phone, regionCode, gender, userImage);
            return new JavaScriptSerializer().Serialize(u);
        }
        public static string SaveUserImage(string userID, string imgPath)
        {
            User u = DBServices.SaveUserImage(userID, imgPath);
            return new JavaScriptSerializer().Serialize(u);
        }
        public static string SavePetImage2(string petID, string imgPath)
        {
            Pets p = DBServices.SavePetImage(petID, imgPath);
            return new JavaScriptSerializer().Serialize(p);
        }
        public static string UpdateUser(string userID, string password, string email, string phone, int regionCode)
        {
            return new JavaScriptSerializer().Serialize(DBServices.UpdateUser(userID, password, email, phone, regionCode));
        }
        public static string GetPetDetails(int petID)
        {
            Pets p = DBServices.GetPetDetails(petID);
            return new JavaScriptSerializer().Serialize(p);
        }
        public static string GetPetsInfo(int isDog, int regionId, bool sortByAge, bool sortByGender)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetsInfo(isDog, regionId, sortByAge, sortByGender));
        }
        public static string GetOwnerPhoneNumber(string userID)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetOwnerPhoneNumber(userID));
        }
        public static string GetCategoriesTypes()
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetCategoriesTypes());
        }
        public static string GetPetRace(int raceCode)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetPetRace(raceCode));
        }
        public static string GetCategoryDetails(int key)
        {
            return new JavaScriptSerializer().Serialize(DBServices.GetCategoryDetails(key));
        }
        public static string PetRegistration(string name, int age, int raceCode, bool isDog, int userCode, char gender, string vaccines, string img = "")
        {
            return new JavaScriptSerializer().Serialize(DBServices.PetRegistration(name,age,raceCode,isDog,userCode,gender,vaccines,img));
        }
    }
}
