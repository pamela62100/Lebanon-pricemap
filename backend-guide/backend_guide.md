# ASP.NET Core Backend Guide for Beginners

Welcome to backend development! Building a backend in ASP.NET Core is highly structured, which is great because it gives you a clear pattern to follow. 

Here is everything you need to know about how the files are organized, what each layer does, and exactly where you should start.

---

## 1. The Standard File Structure
In a professional ASP.NET Core project, we split the code into different folders based on their **responsibility**. This is called an *N-Tier* or *Layered* architecture.

Here is the folder structure we are going to use for this project:

``` text
LebanonPriceMap.Server/
├── Controllers/       # (The APIs) Receives HTTP requests and returns responses.
├── Services/          # (The Brains) Contains all the complex business logic.
├── DTOs/              # (The Mail) Data Transfer Objects: Shapes the data going in and out.
├── Models/            # (The Database Tables) C# classes that represent your DB tables.
├── Data/              # (The DB Connection) Contains `AppDbContext.cs` and Entity Framework configs.
├── Migrations/        # (Auto-generated) Auto-generated files that update your SQL database.
├── Extensions/        # (Helpers) Helper methods to make things like JWT or Auth setup cleaner.
├── Middlewares/       # (The Guards) Code that runs on every request (e.g., Global Error Handling).
└── Program.cs         # (The Starting Point) Where the application boots up and wires everything together.
```

## 2. What Each Layer Does
Let's trace a request (like creating a user) through these layers:

1. **DTOs (Data Transfer Objects)**: 
   The React frontend sends a JSON payload containing `{ email, password }`. We define a `RegisterDto` class to strictly define that this endpoint only accepts those two fields.
2. **Controllers**: 
   The request hits `AuthControllers.cs`. The controller is very "thin". It doesn't do complex math or talk to the database. Its job is just to say: *"I received a request, I'll pass it to the Auth Service, and I will return a 200 OK or 400 Bad Request to the browser."*
3. **Services**: 
   The controller passes the data to `AuthService.cs`. This is where the heavy lifting happens. The service says:
   - "Does this email exist?"
   - "Hash the password."
   - "Create a JWT token."
4. **Data & Models**: 
   The Service uses [AppDbContext](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/Data/AppDbContext.cs#6-37) (your database connection) to take a [User](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/User.cs#3-22) Model and save it permanently into the PostgreSQL database.

**Why use Services instead of putting everything in the Controller?**
If you put everything in the controller, it becomes massive and impossible to test. By extracting logic into Services, you can reuse that logic anywhere (e.g., a background task could reuse the exact same code).

---

## 3. How You Should Start (The Workflow)
When building a brand new backend project, you shouldn't start by building controllers. You always start from the "bottom" (the database) and work your way "up" (to the APIs).

### Step 1: Define the Database Foundation (Models & DbContext)
Before you can write code to save a user, the database needs to exist.
- We create C# classes in the `Models/` folder representing your physical tables (Users, Stores, Products).
- We configure how they map to PostgreSQL inside [Data/AppDbContext.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/Data/AppDbContext.cs).
- We run a command (`dotnet ef migrations add...`) to magically turn those C# classes into actual SQL database tables.

### Step 2: Set up Shared Plumbing
- Configure JWT Authentication in [Program.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/Program.cs) so the app knows how to read tokens.
- Add a Global Error Handler (`GlobalExceptionMiddleware.cs`) so that if the code crashes, it returns a clean JSON error to the frontend instead of a scary HTML error page.

### Step 3: Build Your First Feature (Auth)
Now you follow the sequence for a single feature:
1. **Define the shape**: Create `LoginDto.cs` in the `DTOs/` folder.
2. **Write the logic**: Create `IAuthService` and `AuthService` to handle password hashing and tokens.
3. **Expose the edge**: Create `AuthController.cs` to give the React frontend an endpoint (`POST /api/auth/login`) to call.

---

### What's Our Next Move?
If you are ready, I will start executing **"Step 1"**. 

I will:
1. Create the `Models/` folder.
2. Move your existing [User.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/User.cs) inside and create the other core tables (`Store`, `Product`, `StoreCatalogItem`).
3. Wire them up exactly as described in the Master Plan so your database perfectly matches your React frontend.

Sound good? Just let me know to proceed with Step 1!
