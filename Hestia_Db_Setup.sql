CREATE DATABASE Hestia
GO

USING Hestia
GO

CREATE TABLE HomeInfo (
    [Id] int PRIMARY KEY IDENTITY,
    [Address] NVARCHAR(60) NOT NULL,
    [Price] NVARCHAR(10) NOT NULL
)
GO

CREATE TYPE HomeInfoTvp AS TABLE
(
    [Address] NVARCHAR(60) NOT NULL,
    [Price] NVARCHAR(10) NOT NULL
)
GO

CREATE FUNCTION CreateHomeInfoTvpFromColonDelimitedList
(
    @ColonDelimitedListOfColumns NVARCHAR(MAX)
)
RETURNS @HomeInfoTvp TABLE
(
    [Address] NVARCHAR(60) NOT NULL,
    [Price] NVARCHAR(10) NOT NULL
)
AS
BEGIN
    
    -- TODO: Create TVP from colon delimited list of column values
        
    RETURN
END
GO

CREATE PROCEDURE InsertHomeInfoList
@SemicolonDelimitedHomeInfoList NVARCHAR(MAX)
AS
    SET NOCOUNT ON

    DECLARE
        @HomeInfoRowsCursor CURSOR,
        @ColonDelimitedListOfColumns NVARCHAR(61)

    IF @HomeInfoList IS NOT NULL
    BEGIN
        SET @HomeInfoRowsCursor = CURSOR FOR SELECT VALUE FROM string_split(@SemicolonDelimitedHomeInfoList, ';') WHERE RTRIM(VALUE) <> ''
        OPEN @HomeInfoRowsCursor
        FETCH NEXT FROM @HomeInfoRowsCursor INTO @ColonDelimitedListOfColumns

        WHILE @@FETCH_STATUS = 0
        BEGIN

        INSERT INTO HomeInfo ([Address], [Price]) SELECT [Address], [Price] FROM CreateHomeInfoTvpFromColonDelimitedList(@ColonDelimitedListOfColumns)
        
        FETCH NEXT FROM @HomeInfoRowsCursor INTO @ColonDelimitedListOfColumns
        END

        CLOSE @HomeInfoRowsCursor
        DEALLOCATE @HomeInfoRowsCursor

        RETURN 1
    END
    RETURN 0
GO