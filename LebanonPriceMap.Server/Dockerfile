# --- build stage ------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# copy csproj first (for caching restore)
COPY *.sln ./
COPY LebanonPriceMap.Server/*.csproj ./LebanonPriceMap.Server/

RUN dotnet restore

# now copy everything else
COPY . .

RUN dotnet publish -c Release -o out

# --- runtime stage ----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "LebanonPriceMap.Server.dll"]