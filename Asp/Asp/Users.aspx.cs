using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class MainPage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            //string conn = "Initial Catalog = site02; Persist Security Info = True; User ID = site02; Password = 19Kh1mx#";
            //FZ.ConnectionString = conn;
        }
    }

    protected void linkCategories_Click(object sender, EventArgs e)
    {
        Server.Transfer("Categories.aspx");
    }

    protected void linkUsers_Click(object sender, EventArgs e)
    {
        Server.Transfer("Users.aspx");
    }

    protected void linkCategoryType_Click(object sender, EventArgs e)
    {
        Server.Transfer("CategoryTypes.aspx");
    }

    protected void linkPets_Click(object sender, EventArgs e)
    {
        Server.Transfer("Pets.aspx");
    }

    protected void linkPetRaces_Click(object sender, EventArgs e)
    {
        Server.Transfer("PetRaces.aspx");
    }

    protected void linkRegions_Click(object sender, EventArgs e)
    {
        Server.Transfer("Regions.aspx");
    }
}