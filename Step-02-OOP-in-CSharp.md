# Step 2 — OOP in C# 🟢

> **Why this matters:** OOP (Object-Oriented Programming) is the **heart of C#**. Interviewers
> almost always ask the 4 pillars, and the difference between an interface and an abstract class.
> These questions decide if you "think in objects". Read slowly. 👇

---

## 🟢 BASIC

### Q1. What is OOP? What are its 4 pillars?

**Simple answer:** OOP is a way of writing code by grouping **data + behavior** together into **objects** (built from **classes**). It models real-world things.

The **4 pillars** (remember the word **"A PIE"**):

| Pillar | Simple meaning | One-line example |
|---|---|---|
| **A**bstraction | Show only what's needed, hide the messy details | A `car.Start()` — you don't see the engine logic |
| **E**ncapsulation | Keep data safe inside a class, control access | `private` fields + `public` properties |
| **I**nheritance | A child class reuses a parent class's code | `Dog : Animal` |
| **P**olymorphism | Same method name behaves differently | `Draw()` on Circle vs Square |

**💬 Interview tip:** Memorize **"A PIE"** so you never forget the 4. Then give one tiny real example for each.

---

### Q2. What is a Class and what is an Object?

**Simple answer:**
- **Class** = a blueprint / template (it doesn't exist in memory yet).
- **Object** = a real thing built from that blueprint (it lives in memory).

```csharp
class Car            // blueprint
{
    public string Model { get; set; }
    public void Drive() => Console.WriteLine($"{Model} is driving");
}

Car myCar = new Car();   // object (real instance)
myCar.Model = "Tesla";
myCar.Drive();           // Tesla is driving
```

**💬 Interview tip:** Use the blueprint analogy: *"A class is the design of a house; an object is the actual house built from it. You can build many objects from one class."*

---

### Q3. What is Encapsulation? Why use private fields with public properties?

**Simple answer:** Encapsulation means **hiding the internal data** and only allowing access through controlled "doors" (properties/methods). This protects the data from invalid changes.

```csharp
class BankAccount
{
    private decimal _balance;          // hidden — nobody can set it directly

    public decimal Balance => _balance; // read-only door

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Must be positive");
        _balance += amount;            // controlled change with validation
    }
}
```

Without encapsulation, anyone could write `account._balance = -5000;` — that's dangerous.

**💬 Interview tip:** Say *"Encapsulation lets me add validation and keep the object in a valid state — outside code can't put it into a bad state directly."*

---

### Q4. What is Inheritance? What are its benefits?

**Simple answer:** Inheritance lets a **child class reuse and extend** a parent class. The child gets the parent's fields/methods for free.

```csharp
class Animal
{
    public void Eat() => Console.WriteLine("Eating...");
}

class Dog : Animal     // Dog inherits from Animal
{
    public void Bark() => Console.WriteLine("Woof!");
}

var d = new Dog();
d.Eat();   // inherited from Animal
d.Bark();  // its own
```

**Benefits:** less code duplication, easier maintenance, logical hierarchy.

**💬 Interview tip:** Mention the **"is-a" rule**: *"Use inheritance only when the child truly IS the parent — a Dog is an Animal. If it's not a true is-a relationship, I prefer composition."*

---

### Q5. What is Polymorphism?

**Simple answer:** "Poly" = many, "morph" = forms. **Same method name, different behavior** depending on the object.

Two types:
1. **Compile-time (Overloading)** — same method name, different parameters.
2. **Run-time (Overriding)** — child class replaces parent's method using `virtual` / `override`.

```csharp
class Shape
{
    public virtual void Draw() => Console.WriteLine("Drawing a shape");
}
class Circle : Shape
{
    public override void Draw() => Console.WriteLine("Drawing a circle");
}

Shape s = new Circle();
s.Draw();   // "Drawing a circle"  ← decided at run-time
```

**💬 Interview tip:** Clearly split the two kinds: *"Overloading is compile-time polymorphism (same name, different parameters). Overriding is run-time polymorphism using virtual/override."*

---

## 🟡 INTERMEDIATE

### Q6. What is the difference between Method Overloading and Method Overriding?

**Simple answer:**

| | Overloading | Overriding |
|---|---|---|
| What | Same name, **different parameters** | Child **replaces** parent's method |
| Same class? | Yes (within one class) | No (parent → child) |
| Keywords | none needed | `virtual` (parent) + `override` (child) |
| Decided | **Compile-time** | **Run-time** |

```csharp
// Overloading
int Add(int a, int b) => a + b;
double Add(double a, double b) => a + b;   // same name, different params

// Overriding — see Q5 example (virtual/override)
```

**💬 Interview tip:** One-liner: *"Overloading = same name, different signature, same class. Overriding = redefining a base method in a derived class."*

---

### Q7. What is the difference between an Interface and an Abstract Class? (VERY common!)

**Simple answer:** Both are "contracts" you can't instantiate directly, but they differ:

| | Interface | Abstract Class |
|---|---|---|
| Contains | Method **signatures** (and default methods in C# 8+) | Both **abstract** AND **normal** methods (with code) |
| Fields | No fields/state | Can have fields & constructors |
| Multiple? | A class can implement **many** interfaces | A class can inherit **only one** abstract class |
| Use when | Many unrelated classes share a capability (`IDisposable`) | Classes share a common base + some shared code |

```csharp
interface IPayment        // pure contract
{
    void Pay(decimal amount);
}

abstract class Employee   // shared base with some code
{
    public string Name { get; set; }
    public abstract decimal CalculateSalary();   // must override
    public void ClockIn() => Console.WriteLine($"{Name} clocked in"); // shared code
}
```

**💬 Interview tip:** The decider line: *"I use an interface for a 'can-do' capability that many unrelated classes share, and an abstract class when classes share a common identity AND some default implementation. Also, you can implement many interfaces but inherit only one class."*

---

### Q8. What are Access Modifiers in C#?

**Simple answer:** They control **who can see/use** a member.

| Modifier | Who can access |
|---|---|
| `public` | Everyone |
| `private` | Only inside the same class |
| `protected` | Same class + child classes |
| `internal` | Anywhere in the **same project/assembly** |
| `protected internal` | Same assembly **OR** child classes |
| `private protected` | Same assembly **AND** child classes |

**💬 Interview tip:** Say *"I default to the most restrictive (`private`) and only open up access when needed — that's good encapsulation."*

---

### Q9. What is the difference between `abstract` and `virtual` methods?

**Simple answer:**
- **`virtual`** → has a body in the parent; child **may** override it (optional).
- **`abstract`** → has **no body**; child **must** override it (mandatory). Only allowed in an abstract class.

```csharp
abstract class Shape
{
    public abstract double Area();             // MUST override (no body)
    public virtual void Info() => Console.WriteLine("I am a shape"); // MAY override
}
```

**💬 Interview tip:** *"`abstract` forces the child to implement; `virtual` gives the child an optional override with a default already provided."*

---

## 🔴 ADVANCED

### Q10. What is the difference between `static` and instance members?

**Simple answer:**
- **Instance member** → belongs to each object. Each object has its own copy.
- **`static` member** → belongs to the **class itself**, shared by all. No object needed to use it.

```csharp
class Counter
{
    public static int TotalCount;  // shared across ALL objects
    public int Id;                 // unique per object
}

Counter.TotalCount++;   // called on the class, not an object
```

**💬 Interview tip:** Real use: *"I use static for utility/helper methods and shared constants — like `Math.Max()`. But too much static state hurts testability, so I avoid it for business logic."*

---

### Q11. What is the difference between Composition and Inheritance? ("has-a" vs "is-a")

**Simple answer:**
- **Inheritance ("is-a")** → `Dog is an Animal`.
- **Composition ("has-a")** → `Car has an Engine` (the Car holds an Engine object inside it).

```csharp
class Engine { public void Start() => Console.WriteLine("Vroom"); }

class Car
{
    private readonly Engine _engine = new Engine();  // composition
    public void Start() => _engine.Start();
}
```

Modern advice: **"Favor composition over inheritance"** — it's more flexible and avoids deep, fragile class trees.

**💬 Interview tip:** This impresses interviewers: *"I prefer composition over inheritance because it's more flexible and loosely coupled — inheritance can create rigid hierarchies that are hard to change."*

---

### Q12. What is the `sealed` keyword? And what does `base` do?

**Simple answer:**
- **`sealed`** → stops a class from being inherited further, or stops a method from being overridden again.
- **`base`** → lets a child call the parent's constructor or method.

```csharp
sealed class FinalClass { }   // nobody can inherit this

class Manager : Employee
{
    public Manager(string name) : base(name) { }  // calls parent's constructor
    public override decimal CalculateSalary()
        => base.CalculateSalary() + 5000;          // reuse parent logic + add
}
```

**💬 Interview tip:** *"`sealed` is used for security or to prevent unintended overriding (e.g. `string` is sealed). `base` lets me reuse parent behavior instead of rewriting it."*

---

## 🎬 SCENARIO QUESTIONS

### Scenario 1
> *"You're designing a payment system that supports Credit Card, PayPal, and UPI. New methods get added often. How would you design this using OOP?"*

**Model answer:** *"I'd define an `IPayment` interface with a `Pay(amount)` method, and create one class per provider (`CreditCardPayment`, `PayPalPayment`, `UpiPayment`) that implements it. My code depends on the `IPayment` interface, not concrete classes, so adding a new payment method just means adding a new class — no existing code changes. That's the Open/Closed Principle and it uses polymorphism."*

---

### Scenario 2
> *"Two classes, `Manager` and `Developer`, share common fields like Name and Id, plus a salary calculation that differs. Interface or abstract class?"*

**Model answer:** *"Abstract class. They share common identity and data (Name, Id) plus shared behavior, so I'd put those in an abstract `Employee` base class with a `CalculateSalary()` abstract method that each subclass overrides differently. If they only shared an unrelated capability, I'd use an interface instead."*

---

### Scenario 3
> *"A junior developer made a class field `public` so it's 'easier to access'. Why is that a problem and what would you suggest?"*

**Model answer:** *"A public field breaks encapsulation — any code can set an invalid value with no validation, and you lose control over how the data changes. I'd make the field private and expose a public property with validation in the setter, or a method. This keeps the object always in a valid state."*

---

## 📝 QUICK REVISION (last-minute scan)

- **4 pillars = A PIE:** Abstraction, Encapsulation, Inheritance, Polymorphism.
- **Class** = blueprint, **Object** = real instance.
- **Encapsulation** = private data + controlled public access (validation).
- **Inheritance** = "is-a" reuse; **Composition** = "has-a" (prefer composition).
- **Polymorphism:** Overloading (compile-time) vs Overriding (run-time, virtual/override).
- **Interface** = capability many classes share, multiple allowed; **Abstract class** = common base + shared code, only one.
- **`abstract`** = must override; **`virtual`** = may override.
- **`static`** = shared by class; **instance** = per object.
- **`sealed`** = block inheritance; **`base`** = call parent.

---

## ✅ SELF-CHECK (answer these on your own)

1. Name the 4 pillars without looking, and give a one-line example of each.
2. Give one situation where you'd pick an interface, and one where you'd pick an abstract class.
3. What's the difference between overloading and overriding? Which is run-time?
4. Why is "favor composition over inheritance" good advice?
5. Rewrite a class with a `public decimal Balance;` field to be properly encapsulated.

---

🎉 **Done with Step 2?** Tick it in `00-START-HERE.md`, then tell me **"create next step"** to unlock **Step 3 — C# Advanced (delegates, events, generics)**.
