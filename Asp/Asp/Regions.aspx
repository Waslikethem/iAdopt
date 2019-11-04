<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Regions.aspx.cs" Inherits="MainPage" %>

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
            <asp:Label ID="title3" runat="server" Text="Regions Table" Font-Bold="True" Font-Size="Large"></asp:Label>
            <asp:ListView ID="ListView1" runat="server" DataKeyNames="RegionID" DataSourceID="SqlDataSource1" InsertItemPosition="LastItem">
                <AlternatingItemTemplate>
                    <tr style="background-color:#FFF8DC;">
                        <td>
                            <asp:Button ID="DeleteButton" runat="server" CommandName="Delete" Text="Delete" />
                            <asp:Button ID="EditButton" runat="server" CommandName="Edit" Text="Edit" />
                        </td>
                        <td>
                            <asp:Label ID="RegionIDLabel" runat="server" Text='<%# Eval("RegionID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RegionNameLabel" runat="server" Text='<%# Eval("RegionName") %>' />
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
                            <asp:Label ID="RegionIDLabel1" runat="server" Text='<%# Eval("RegionID") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="RegionNameTextBox" runat="server" Text='<%# Bind("RegionName") %>' />
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
                            <asp:TextBox ID="RegionNameTextBox" runat="server" Text='<%# Bind("RegionName") %>' />
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
                            <asp:Label ID="RegionIDLabel" runat="server" Text='<%# Eval("RegionID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RegionNameLabel" runat="server" Text='<%# Eval("RegionName") %>' />
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
                                        <th runat="server">RegionID</th>
                                        <th runat="server">RegionName</th>
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
                            <asp:Label ID="RegionIDLabel" runat="server" Text='<%# Eval("RegionID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RegionNameLabel" runat="server" Text='<%# Eval("RegionName") %>' />
                        </td>
                    </tr>
                </SelectedItemTemplate>
            </asp:ListView>
            <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:site02ASP %>" DeleteCommand="DELETE FROM [Regions] WHERE [RegionID] = @original_RegionID" InsertCommand="INSERT INTO [Regions] ([RegionName]) VALUES (@RegionName)" OldValuesParameterFormatString="original_{0}" SelectCommand="SELECT * FROM [Regions]" UpdateCommand="UPDATE [Regions] SET [RegionName] = @RegionName WHERE [RegionID] = @original_RegionID">
                <DeleteParameters>
                    <asp:Parameter Name="original_RegionID" Type="Int32" />
                </DeleteParameters>
                <InsertParameters>
                    <asp:Parameter Name="RegionName" Type="String" />
                </InsertParameters>
                <UpdateParameters>
                    <asp:Parameter Name="RegionName" Type="String" />
                    <asp:Parameter Name="original_RegionID" Type="Int32" />
                </UpdateParameters>
            </asp:SqlDataSource>
        </div>

        <div style="text-align: center; background-color: black; position: fixed; bottom: 0; left: 0; width: 100%">
            <asp:Label ID="Label1" runat="server" Text="Nathaniel &amp; Ofir 2019 &amp;copy;" ForeColor="White"></asp:Label>
        </div>
    </form>
</body>
</html>
