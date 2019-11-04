<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Users.aspx.cs" Inherits="MainPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div style="text-align: center">
            <asp:Label ID="title" runat="server" Text="iAdopt<br/>" Font-Bold="True" Font-Size="X-Large"></asp:Label>
            <asp:Label ID="title2" runat="server" Text="Management System" Font-Bold="True" Font-Size="X-Large"></asp:Label>
            <br />
            <asp:LinkButton ID="linkUsers" runat="server" OnClick="linkUsers_Click">Users</asp:LinkButton>
            &nbsp;&nbsp;&nbsp;
            <asp:LinkButton ID="linkCategories" runat="server" OnClick="linkCategories_Click">Categories</asp:LinkButton>
            &nbsp;&nbsp;&nbsp;
            <asp:LinkButton ID="linkCategoryType" runat="server" OnClick="linkCategoryType_Click">Category Types</asp:LinkButton>
            &nbsp;&nbsp;&nbsp;
            <asp:LinkButton ID="linkPets" runat="server" OnClick="linkPets_Click">Pets</asp:LinkButton>
            &nbsp;&nbsp;&nbsp;
            <asp:LinkButton ID="linkPetRaces" runat="server" OnClick="linkPetRaces_Click">Pet Races</asp:LinkButton>
            &nbsp;&nbsp;&nbsp;
            <asp:LinkButton ID="linkRegions" runat="server" OnClick="linkRegions_Click">Regions</asp:LinkButton>
            <br />
            <br />
            <asp:Label ID="title3" runat="server" Text="Users Table" Font-Bold="True" Font-Size="Large"></asp:Label>
            <asp:ListView ID="ListView1" runat="server" DataKeyNames="UserID" DataSourceID="SqlDataSource1" InsertItemPosition="LastItem">
                <AlternatingItemTemplate>
                    <tr style="background-color:#FFF8DC;">
                        <td>
                            <asp:Button ID="DeleteButton" runat="server" CommandName="Delete" Text="Delete" />
                            <asp:Button ID="EditButton" runat="server" CommandName="Edit" Text="Edit" />
                        </td>
                        <td>
                            <asp:Label ID="UserIDLabel" runat="server" Text='<%# Eval("UserID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="UserNameLabel" runat="server" Text='<%# Eval("UserName") %>' />
                        </td>
                        <td>
                            <asp:Label ID="PasswordLabel" runat="server" Text='<%# Eval("Password") %>' />
                        </td>
                        <td>
                            <asp:Label ID="EmailLabel" runat="server" Text='<%# Eval("Email") %>' />
                        </td>
                        <td>
                            <asp:Label ID="FnameLabel" runat="server" Text='<%# Eval("Fname") %>' />
                        </td>
                        <td>
                            <asp:Label ID="LnameLabel" runat="server" Text='<%# Eval("Lname") %>' />
                        </td>
                        <td>
                            <asp:Label ID="PhoneLabel" runat="server" Text='<%# Eval("Phone") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RegionCodeLabel" runat="server" Text='<%# Eval("RegionCode") %>' />
                        </td>
                        <td>
                            <asp:Label ID="GenderLabel" runat="server" Text='<%# Eval("Gender") %>' />
                        </td>
                        <td>
                            <asp:Label ID="UserImageLabel" runat="server" Text='<%# Eval("UserImage") %>' />
                        </td>
                    </tr>
                </AlternatingItemTemplate>
                <EditItemTemplate>
                    <tr style="background-color:#008A8C;color: #FFFFFF;">
                        <td>
                            <asp:Button ID="UpdateButton" runat="server" CommandName="Update" Text="Update" />
                            <asp:Button ID="CancelButton" runat="server" CommandName="Cancel" Text="Cancel" />
                        </td>
                        <td>
                            <asp:Label ID="UserIDLabel1" runat="server" Text='<%# Eval("UserID") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="UserNameTextBox" runat="server" Text='<%# Bind("UserName") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="PasswordTextBox" runat="server" Text='<%# Bind("Password") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="EmailTextBox" runat="server" Text='<%# Bind("Email") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="FnameTextBox" runat="server" Text='<%# Bind("Fname") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="LnameTextBox" runat="server" Text='<%# Bind("Lname") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="PhoneTextBox" runat="server" Text='<%# Bind("Phone") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="RegionCodeTextBox" runat="server" Text='<%# Bind("RegionCode") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="GenderTextBox" runat="server" Text='<%# Bind("Gender") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="UserImageTextBox" runat="server" Text='<%# Bind("UserImage") %>' />
                        </td>
                    </tr>
                </EditItemTemplate>
                <EmptyDataTemplate>
                    <table runat="server" style="background-color: #FFFFFF;border-collapse: collapse;border-color: #999999;border-style:none;border-width:1px;">
                        <tr>
                            <td>No data was returned.</td>
                        </tr>
                    </table>
                </EmptyDataTemplate>
                <InsertItemTemplate>
                    <tr style="">
                        <td>
                            <asp:Button ID="InsertButton" runat="server" CommandName="Insert" Text="Insert" />
                            <asp:Button ID="CancelButton" runat="server" CommandName="Cancel" Text="Clear" />
                        </td>
                        <td>&nbsp;</td>
                        <td>
                            <asp:TextBox ID="UserNameTextBox" runat="server" Text='<%# Bind("UserName") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="PasswordTextBox" runat="server" Text='<%# Bind("Password") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="EmailTextBox" runat="server" Text='<%# Bind("Email") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="FnameTextBox" runat="server" Text='<%# Bind("Fname") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="LnameTextBox" runat="server" Text='<%# Bind("Lname") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="PhoneTextBox" runat="server" Text='<%# Bind("Phone") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="RegionCodeTextBox" runat="server" Text='<%# Bind("RegionCode") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="GenderTextBox" runat="server" Text='<%# Bind("Gender") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="UserImageTextBox" runat="server" Text='<%# Bind("UserImage") %>' />
                        </td>
                    </tr>
                </InsertItemTemplate>
                <ItemTemplate>
                    <tr style="background-color:#DCDCDC;color: #000000;">
                        <td>
                            <asp:Button ID="DeleteButton" runat="server" CommandName="Delete" Text="Delete" />
                            <asp:Button ID="EditButton" runat="server" CommandName="Edit" Text="Edit" />
                        </td>
                        <td>
                            <asp:Label ID="UserIDLabel" runat="server" Text='<%# Eval("UserID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="UserNameLabel" runat="server" Text='<%# Eval("UserName") %>' />
                        </td>
                        <td>
                            <asp:Label ID="PasswordLabel" runat="server" Text='<%# Eval("Password") %>' />
                        </td>
                        <td>
                            <asp:Label ID="EmailLabel" runat="server" Text='<%# Eval("Email") %>' />
                        </td>
                        <td>
                            <asp:Label ID="FnameLabel" runat="server" Text='<%# Eval("Fname") %>' />
                        </td>
                        <td>
                            <asp:Label ID="LnameLabel" runat="server" Text='<%# Eval("Lname") %>' />
                        </td>
                        <td>
                            <asp:Label ID="PhoneLabel" runat="server" Text='<%# Eval("Phone") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RegionCodeLabel" runat="server" Text='<%# Eval("RegionCode") %>' />
                        </td>
                        <td>
                            <asp:Label ID="GenderLabel" runat="server" Text='<%# Eval("Gender") %>' />
                        </td>
                        <td>
                            <asp:Label ID="UserImageLabel" runat="server" Text='<%# Eval("UserImage") %>' />
                        </td>
                    </tr>
                </ItemTemplate>
                <LayoutTemplate>
                    <table runat="server">
                        <tr runat="server">
                            <td runat="server">
                                <table id="itemPlaceholderContainer" runat="server" border="1" style="background-color: #FFFFFF;border-collapse: collapse;border-color: #999999;border-style:none;border-width:1px;font-family: Verdana, Arial, Helvetica, sans-serif;">
                                    <tr runat="server" style="background-color:#DCDCDC;color: #000000;">
                                        <th runat="server"></th>
                                        <th runat="server">UserID</th>
                                        <th runat="server">UserName</th>
                                        <th runat="server">Password</th>
                                        <th runat="server">Email</th>
                                        <th runat="server">Fname</th>
                                        <th runat="server">Lname</th>
                                        <th runat="server">Phone</th>
                                        <th runat="server">RegionCode</th>
                                        <th runat="server">Gender</th>
                                        <th runat="server">UserImage</th>
                                    </tr>
                                    <tr id="itemPlaceholder" runat="server">
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr runat="server">
                            <td runat="server" style="text-align: center;background-color: #CCCCCC;font-family: Verdana, Arial, Helvetica, sans-serif;color: #000000;">
                                <asp:DataPager ID="DataPager1" runat="server">
                                    <Fields>
                                        <asp:NextPreviousPagerField ButtonType="Button" ShowFirstPageButton="True" ShowNextPageButton="False" ShowPreviousPageButton="False" />
                                        <asp:NumericPagerField />
                                        <asp:NextPreviousPagerField ButtonType="Button" ShowLastPageButton="True" ShowNextPageButton="False" ShowPreviousPageButton="False" />
                                    </Fields>
                                </asp:DataPager>
                            </td>
                        </tr>
                    </table>
                </LayoutTemplate>
                <SelectedItemTemplate>
                    <tr style="background-color:#008A8C;font-weight: bold;color: #FFFFFF;">
                        <td>
                            <asp:Button ID="DeleteButton" runat="server" CommandName="Delete" Text="Delete" />
                            <asp:Button ID="EditButton" runat="server" CommandName="Edit" Text="Edit" />
                        </td>
                        <td>
                            <asp:Label ID="UserIDLabel" runat="server" Text='<%# Eval("UserID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="UserNameLabel" runat="server" Text='<%# Eval("UserName") %>' />
                        </td>
                        <td>
                            <asp:Label ID="PasswordLabel" runat="server" Text='<%# Eval("Password") %>' />
                        </td>
                        <td>
                            <asp:Label ID="EmailLabel" runat="server" Text='<%# Eval("Email") %>' />
                        </td>
                        <td>
                            <asp:Label ID="FnameLabel" runat="server" Text='<%# Eval("Fname") %>' />
                        </td>
                        <td>
                            <asp:Label ID="LnameLabel" runat="server" Text='<%# Eval("Lname") %>' />
                        </td>
                        <td>
                            <asp:Label ID="PhoneLabel" runat="server" Text='<%# Eval("Phone") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RegionCodeLabel" runat="server" Text='<%# Eval("RegionCode") %>' />
                        </td>
                        <td>
                            <asp:Label ID="GenderLabel" runat="server" Text='<%# Eval("Gender") %>' />
                        </td>
                        <td>
                            <asp:Label ID="UserImageLabel" runat="server" Text='<%# Eval("UserImage") %>' />
                        </td>
                    </tr>
                </SelectedItemTemplate>
            </asp:ListView>
            <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:site02ASP %>" DeleteCommand="DELETE FROM [Users] WHERE [UserID] = @original_UserID" InsertCommand="INSERT INTO [Users] ([UserName], [Password], [Email], [Fname], [Lname], [Phone], [RegionCode], [Gender], [UserImage]) VALUES (@UserName, @Password, @Email, @Fname, @Lname, @Phone, @RegionCode, @Gender, @UserImage)" OldValuesParameterFormatString="original_{0}" SelectCommand="SELECT * FROM [Users]" UpdateCommand="UPDATE [Users] SET [UserName] = @UserName, [Password] = @Password, [Email] = @Email, [Fname] = @Fname, [Lname] = @Lname, [Phone] = @Phone, [RegionCode] = @RegionCode, [Gender] = @Gender, [UserImage] = @UserImage WHERE [UserID] = @original_UserID">
                <DeleteParameters>
                    <asp:Parameter Name="original_UserID" Type="Int32" />
                </DeleteParameters>
                <InsertParameters>
                    <asp:Parameter Name="UserName" Type="String" />
                    <asp:Parameter Name="Password" Type="String" />
                    <asp:Parameter Name="Email" Type="String" />
                    <asp:Parameter Name="Fname" Type="String" />
                    <asp:Parameter Name="Lname" Type="String" />
                    <asp:Parameter Name="Phone" Type="String" />
                    <asp:Parameter Name="RegionCode" Type="Int32" />
                    <asp:Parameter Name="Gender" Type="String" />
                    <asp:Parameter Name="UserImage" Type="String" />
                </InsertParameters>
                <UpdateParameters>
                    <asp:Parameter Name="UserName" Type="String" />
                    <asp:Parameter Name="Password" Type="String" />
                    <asp:Parameter Name="Email" Type="String" />
                    <asp:Parameter Name="Fname" Type="String" />
                    <asp:Parameter Name="Lname" Type="String" />
                    <asp:Parameter Name="Phone" Type="String" />
                    <asp:Parameter Name="RegionCode" Type="Int32" />
                    <asp:Parameter Name="Gender" Type="String" />
                    <asp:Parameter Name="UserImage" Type="String" />
                    <asp:Parameter Name="original_UserID" Type="Int32" />
                </UpdateParameters>
            </asp:SqlDataSource>
            <br />
        </div>

        <div style="text-align: center; background-color: black; position: fixed; bottom: 0; left: 0; width: 100%">
            <asp:Label ID="Label1" runat="server" Text="Nathaniel &amp; Ofir 2019 &amp;copy;" ForeColor="White"></asp:Label>
        </div>
    </form>
</body>
</html>
