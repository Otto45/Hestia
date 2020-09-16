CREATE DATABASE Hestia
GO

USE Hestia
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
    DECLARE
    @ColonDelimitedList NVARCHAR(MAX) = @ColonDelimitedListOfColumns,
    @AddressFromList NVARCHAR(60),
    @PriceFromList NVARCHAR(10),
    @PrevStringLen INT

    SELECT @AddressFromList = SUBSTRING(@ColonDelimitedList, 1, CHARINDEX(':', @ColonDelimitedList) - 1)

    SELECT @PrevStringLen = LEN(@AddressFromList)
    SELECT @ColonDelimitedList = SUBSTRING(@ColonDelimitedList, CHARINDEX(':', @ColonDelimitedList) + 1, LEN(@ColonDelimitedList) - @PrevStringLen + 1)

    SELECT @PriceFromList = @ColonDelimitedList

    INSERT INTO @HomeInfoTvp ([Address], [Price]) VALUES (TRIM(@AddressFromList), TRIM(@PriceFromList))
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

            INSERT INTO HomeInfo ([Address], [Price]) SELECT [Address], [Price] FROM CreateHomeInfoTvpFromColonDelimitedList(@ColonDelimitedListOfColumns)
        
            FETCH NEXT FROM @HomeInfoRowsCursor INTO @ColonDelimitedListOfColumns
        END

        CLOSE @HomeInfoRowsCursor
        DEALLOCATE @HomeInfoRowsCursor

        RETURN 1
    END
    RETURN 0
GO
