﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PetRaces.aspx.cs" Inherits="MainPage" %>

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
            <asp:Label ID="title3" runat="server" Text="Pet Races Table" Font-Bold="True" Font-Size="Large"></asp:Label>
            <asp:ListView ID="ListView1" runat="server" DataKeyNames="RaceID" DataSourceID="SqlDataSource1" InsertItemPosition="LastItem">
                <AlternatingItemTemplate>
                    <tr style="background-color:#FFF8DC;">
                        <td>
                            <asp:Button ID="DeleteButton" runat="server" CommandName="Delete" Text="Delete" />
                            <asp:Button ID="EditButton" runat="server" CommandName="Edit" Text="Edit" />
                        </td>
                        <td>
                            <asp:Label ID="RaceIDLabel" runat="server" Text='<%# Eval("RaceID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RaceNameLabel" runat="server" Text='<%# Eval("RaceName") %>' />
                        </td>
                        <td>
                            <asp:CheckBox ID="IsDogCheckBox" runat="server" Checked='<%# Eval("IsDog") %>' Enabled="false" />
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
                            <asp:Label ID="RaceIDLabel1" runat="server" Text='<%# Eval("RaceID") %>' />
                        </td>
                        <td>
                            <asp:TextBox ID="RaceNameTextBox" runat="server" Text='<%# Bind("RaceName") %>' />
                        </td>
                        <td>
                            <asp:CheckBox ID="IsDogCheckBox" runat="server" Checked='<%# Bind("IsDog") %>' />
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
                            <asp:TextBox ID="RaceNameTextBox" runat="server" Text='<%# Bind("RaceName") %>' />
                        </td>
                        <td>
                            <asp:CheckBox ID="IsDogCheckBox" runat="server" Checked='<%# Bind("IsDog") %>' />
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
                            <asp:Label ID="RaceIDLabel" runat="server" Text='<%# Eval("RaceID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RaceNameLabel" runat="server" Text='<%# Eval("RaceName") %>' />
                        </td>
                        <td>
                            <asp:CheckBox ID="IsDogCheckBox" runat="server" Checked='<%# Eval("IsDog") %>' Enabled="false" />
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
                                        <th runat="server">RaceID</th>
                                        <th runat="server">RaceName</th>
                                        <th runat="server">IsDog</th>
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
                                        <asp:NextPreviousPagerField ButtonType="Button" ShowFirstPageButton="True" ShowLastPageButton="True" />
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
                            <asp:Label ID="RaceIDLabel" runat="server" Text='<%# Eval("RaceID") %>' />
                        </td>
                        <td>
                            <asp:Label ID="RaceNameLabel" runat="server" Text='<%# Eval("RaceName") %>' />
                        </td>
                        <td>
                            <asp:CheckBox ID="IsDogCheckBox" runat="server" Checked='<%# Eval("IsDog") %>' Enabled="false" />
                        </td>
                    </tr>
                </SelectedItemTemplate>
            </asp:ListView>
            <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:site02ASP %>" DeleteCommand="DELETE FROM [PetRaces] WHERE [RaceID] = @original_RaceID" InsertCommand="INSERT INTO [PetRaces] ([RaceName], [IsDog]) VALUES (@RaceName, @IsDog)" OldValuesParameterFormatString="original_{0}" SelectCommand="SELECT * FROM [PetRaces]" UpdateCommand="UPDATE [PetRaces] SET [RaceName] = @RaceName, [IsDog] = @IsDog WHERE [RaceID] = @original_RaceID">
                <DeleteParameters>
                    <asp:Parameter Name="original_RaceID" Type="Int32" />
                </DeleteParameters>
                <InsertParameters>
                    <asp:Parameter Name="RaceName" Type="String" />
                    <asp:Parameter Name="IsDog" Type="Boolean" />
                </InsertParameters>
                <UpdateParameters>
                    <asp:Parameter Name="RaceName" Type="String" />
                    <asp:Parameter Name="IsDog" Type="Boolean" />
                    <asp:Parameter Name="original_RaceID" Type="Int32" />
                </UpdateParameters>
            </asp:SqlDataSource>
        </div>

        <div style="text-align: center; background-color: black; position: fixed; bottom: 0; left: 0; width: 100%">
            <asp:Label ID="Label1" runat="server" Text="Nathaniel &amp; Ofir 2019 &amp;copy;" ForeColor="White"></asp:Label>
        </div>
    </form>
</body>
</html>