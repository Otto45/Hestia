CREATE DATABASE Hestia
GO

USE Hestia
GO

CREATE TABLE HomeInfo (
    [Id] int PRIMARY KEY IDENTITY,
    [Address] NVARCHAR(60) NOT NULL,
    [Price] NVARCHAR(10) NOT NULL,
    [ScrapedDate] DATETIME NOT NULL
)
GO

CREATE TYPE HomeInfoTvp AS TABLE
(
    [Address] NVARCHAR(60) NOT NULL,
    [Price] NVARCHAR(10) NOT NULL,
    [ScrapedDate] DATETIME NOT NULL
)
GO

CREATE FUNCTION CreateHomeInfoTvpFromColonDelimitedList
(
    @ColonDelimitedListOfColumns NVARCHAR(MAX),
    @CurrentDateTime DATETIME
)
RETURNS @HomeInfoTvp TABLE
(
    [Address] NVARCHAR(60) NOT NULL,
    [Price] NVARCHAR(10) NOT NULL,
    [ScrapedDate] DATETIME NOT NULL
)
AS
BEGIN
    DECLARE
    @ColonDelimitedList NVARCHAR(MAX) = @ColonDelimitedListOfColumns,
    @AddressFromList NVARCHAR(60),
    @PriceFromList NVARCHAR(10),
    @PrevStringLen INT

    SELECT @AddressFromList = SUBSTRING(@ColonDelimitedList, 1, CHARINDEX(':', @ColonDelimitedList) - 1)

    SELECT @PrevStringLen = LEN(@AddressFromList)
    SELECT @ColonDelimitedList = SUBSTRING(@ColonDelimitedList, CHARINDEX(':', @ColonDelimitedList) + 1, LEN(@ColonDelimitedList) - @PrevStringLen + 1)

    SELECT @PriceFromList = @ColonDelimitedList

    INSERT INTO @HomeInfoTvp ([Address], [Price], [ScrapedDate]) VALUES (TRIM(@AddressFromList), TRIM(@PriceFromList), @CurrentDateTime)
    RETURN
END
GO

CREATE PROCEDURE InsertHomeInfoList
@SemicolonDelimitedHomeInfoList NVARCHAR(MAX)
AS
    SET NOCOUNT ON

    DECLARE
        @HomeInfoRowsCursor CURSOR,
        @ColonDelimitedListOfColumns NVARCHAR(61)  -- Size of all individual columns, plus ':' characters

    IF @SemicolonDelimitedHomeInfoList IS NOT NULL
    BEGIN
        SET @HomeInfoRowsCursor = CURSOR FOR SELECT VALUE FROM string_split(@SemicolonDelimitedHomeInfoList, ';') WHERE RTRIM(VALUE) <> ''
        OPEN @HomeInfoRowsCursor
        FETCH NEXT FROM @HomeInfoRowsCursor INTO @ColonDelimitedListOfColumns

        WHILE @@FETCH_STATUS = 0
        BEGIN

            INSERT INTO HomeInfo ([Address], [Price], [ScrapedDate]) SELECT [Address], [Price], [ScrapedDate] FROM CreateHomeInfoTvpFromColonDelimitedList(@ColonDelimitedListOfColumns, GETUTCDATE())
        
            FETCH NEXT FROM @HomeInfoRowsCursor INTO @ColonDelimitedListOfColumns
        END

        CLOSE @HomeInfoRowsCursor
        DEALLOCATE @HomeInfoRowsCursor

        RETURN 1
    END
    RETURN 0
GO
