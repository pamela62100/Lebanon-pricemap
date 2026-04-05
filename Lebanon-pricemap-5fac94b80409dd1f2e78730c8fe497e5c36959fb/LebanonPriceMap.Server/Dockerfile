# --- build stage ------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /app

# Copy everything
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

# --- runtime stage ----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/out .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "LebanonPriceMap.Server.dll"]