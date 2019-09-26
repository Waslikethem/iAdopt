
using BALProj;
using System;
using System.IO;
using System.Web;
using System.Web.Services;


/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService
{

    public WebService()
    {
        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }
    [WebMethod]
    public string GetPetsTable()
    {
        return BALServices.GetPetsTable();
    }
    [WebMethod]
    public string GetTracksTable()
    {
        return BALServices.GetTracksTable();
    }
    [WebMethod]
    public string GetVeterianriansTable()
    {
        return BALServices.GetVeterianriansTable();
    }
    [WebMethod]
    public string GetRegionsTable()
    {
        return BALServices.GetRegionsTable();
    }
    [WebMethod]
    public string Registration(string userName, string password, string email, string fName, string lName, string phone, int regionCode, string gender)
    {
        return BALServices.Registration(userName, password, email, fName, lName, phone, regionCode, gender);
    }
    [WebMethod]
    public string Login(string userNameOrEmail, string userPass)
    {
        return BALServices.Login(userNameOrEmail, userPass);
    }
    [WebMethod]
    public string SaveImage(string userID, string base64, string imageName, string imageType)
    {
        string imgPath;
        try
        {
            imgPath = StoreImage(base64, imageName, imageType, "Users");
            return BALServices.SaveUserImage(userID, imgPath);
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }
    [WebMethod]
    public string UpdateUser(string userID, string password, string email, string phone, int regionCode)
    {
        return BALServices.UpdateUser(userID, password, email, phone, regionCode);
    }
    public string StoreImage(string base64, string imgName, string imageType, string folder)
    {
        try
        {
            String path = HttpContext.Current.Server.MapPath("~/ImageStorage/" + folder); //Path

            //Check if directory exist
            if (!System.IO.Directory.Exists(path))
            {
                System.IO.Directory.CreateDirectory(path); //Create directory if it doesn't exist
            }

            string imageName = imgName + "." + imageType;

            //set the image path
            string imgPath = Path.Combine(path, imageName);

            byte[] imageBytes = Convert.FromBase64String(base64.Replace(" ", "+"));

            File.WriteAllBytes(imgPath, imageBytes);

            return $"{folder}/{imgName}.{imageType}";
        }
        catch (Exception e)
        {
            return e.Message;
        }
    }
}

