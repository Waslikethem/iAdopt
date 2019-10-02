
--pets view with all the data
create view PetsInformation 
as
	SELECT site02.PetDetails.*, site02.Regions.RegionID
	FROM site02.PetDetails INNER JOIN
         site02.Users ON site02.PetDetails.UserCode = site02.Users.UserID INNER JOIN
         site02.Regions ON site02.Users.RegionCode = site02.Regions.RegionID 
go

--all the dogs
select * from PetsInformation where IsDog = 1

--all the cats
select * from PetsInformation where IsDog = 0

--all the pets by user regions
select * from PetsInformation where RegionID = 1

--sort by age
select * from PetsInformation order by Age

--sort by gender
select * from PetsInformation order by Gender
go

create proc GetPetsInfo
	@where nvarchar(max) = null,
	@sort nvarchar(max) = null
as
	declare @sql nvarchar(max)
	set @sql = CONCAT('select * from site02.PetsInformation ',ISNULL(@where, ''), ' ', ISNULL(@sort, ''))
	execute (@sql)
go

--all the information without any sort or filter
exec GetPetsInfo @where = NULL, @sort = NULL
go

-- all the dogs sorted by age
exec GetPetsInfo @where = 'where IsDog = 1', @sort = 'order by Age'
go

-- all the pets in specific region
exec GetPetsInfo @where = 'where RegionID = 1', @sort = NULL
go

-- all the dogs in specific region sorted by age
exec GetPetsInfo @where = 'where IsDog = 1 and RegionID = 1', @sort = 'order by Age'
go

