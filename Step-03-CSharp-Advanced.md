# Step 3 — C# Advanced: Delegates, Events & Generics 🟡

> **Why this matters:** This step is where "junior" turns into "mid-level". Delegates, events
> and generics power **LINQ, async, EF Core, and dependency injection** — the things you use
> every day. Interviewers use these questions to see if you understand *how* .NET works under
> the hood, not just how to call it. Read slowly. 👇

---

## 🟢 BASIC

### Q1. What is a delegate in C#?

**Simple answer:** A **delegate** is a *type-safe function pointer* — a variable that **holds a method** so you can pass that method around and call it later.

Think of it as: *"a variable that stores **a method** instead of a value."*

```csharp
// 1) declare a delegate type (the "shape" of methods it can hold)
delegate int MathOp(int a, int b);

int Add(int a, int b) => a + b;

// 2) store a method in it, then call it
MathOp op = Add;
int result = op(3, 4);   // 7  — calls Add through the delegate
```

**Why care?** Delegates let you pass **behavior** as a parameter — the foundation of callbacks, events, and LINQ.

**💬 Interview tip:** Say *"A delegate is a type-safe reference to a method. It lets me treat a method like a value — store it, pass it to another method, and call it later. It's what makes callbacks and events possible."*

---

### Q2. What are the built-in delegates: `Func`, `Action`, and `Predicate`?

**Simple answer:** Instead of declaring your own delegate type every time, .NET gives you three ready-made ones:

| Delegate | Returns? | Example signature | Use for |
|---|---|---|---|
| `Action<T>` | **void** (nothing) | `Action<string>` | do something, return nothing |
| `Func<T,…,TResult>` | **a value** (last type) | `Func<int,int,int>` | compute and return a value |
| `Predicate<T>` | **bool** | `Predicate<int>` | a yes/no test (a condition) |

```csharp
Action<string> log   = msg => Console.WriteLine(msg);      // returns nothing
Func<int, int, int> add = (a, b) => a + b;                 // returns int
Predicate<int> isEven   = n => n % 2 == 0;                 // returns bool

log("hi");                 // hi
int sum = add(2, 3);       // 5
bool ok = isEven(10);      // true
```

**💬 Interview tip:** One-liner: *"`Action` returns nothing, `Func` always returns a value (the last generic type), and `Predicate` returns a bool. I use these built-in delegates instead of declaring my own."*

---

### Q3. What is a lambda expression (and an anonymous method)?

**Simple answer:** A **lambda** is a short, inline way to write a method without giving it a name. The `=>` is read as *"goes to"*.

```csharp
// long way — a named method
int Square(int x) { return x * x; }

// lambda — same thing, inline & anonymous
Func<int, int> square = x => x * x;

// used everywhere in LINQ:
var evens = numbers.Where(n => n % 2 == 0).ToList();
```

- **`x => x * x`** → take `x`, return `x * x`.
- Multiple statements use braces: `(a, b) => { var s = a + b; return s; }`.
- An **anonymous method** is the older syntax: `delegate(int x) { return x * x; }` — lambdas replaced it.

**💬 Interview tip:** Say *"A lambda is an inline anonymous function. I use them constantly in LINQ — `Where(n => n > 5)` — and anywhere a `Func`/`Action` is expected."*

---

## 🟡 INTERMEDIATE

### Q4. What is an event? How is it different from a delegate?

**Simple answer:** An **event** is a **safe wrapper around a delegate** built for the *publisher / subscriber* pattern: one class **raises** the event, others **subscribe** (`+=`) to be notified.

```csharp
class Button
{
    public event Action? Clicked;          // the event (based on a delegate)

    public void Press()
    {
        Console.WriteLine("Pressed");
        Clicked?.Invoke();                 // raise it (notify all subscribers)
    }
}

var btn = new Button();
btn.Clicked += () => Console.WriteLine("Subscriber 1 reacted");  // subscribe
btn.Press();
```

**The key difference:** with a plain delegate, *outside* code could overwrite it (`Clicked = null`) or call `Invoke()` directly. An `event` only lets outside code **subscribe (`+=`) and unsubscribe (`-=`)** — it cannot raise it or wipe other subscribers. That encapsulation is the whole point.

**💬 Interview tip:** Say *"An event is a restricted delegate. Subscribers can only add or remove handlers with `+=` / `-=`; only the declaring class can raise it. It enforces the publisher/subscriber pattern safely."*

---

### Q5. What is a multicast delegate?

**Simple answer:** A delegate can point to **more than one method** at once. Add methods with `+=`; calling the delegate runs **all of them in order**.

```csharp
Action notify = () => Console.WriteLine("Email sent");
notify += () => Console.WriteLine("SMS sent");   // now holds TWO methods

notify();
// Email sent
// SMS sent
```

- This is exactly how events notify many subscribers.
- ⚠️ **Gotcha:** if it's a `Func` (returns a value), you only get the **last** method's return value — the rest are lost. So multicast is mainly for `Action`/void.

**💬 Interview tip:** *"A multicast delegate holds an invocation list of several methods, called in order. It's the mechanism behind events notifying multiple subscribers."*

---

### Q6. What are Generics and why are they useful?

**Simple answer:** **Generics** let you write code that works with **any type**, using a placeholder `T`, without losing type safety or duplicating code.

```csharp
// one class, works for ANY type
class Box<T>
{
    public T Value { get; set; }
}

var intBox = new Box<int> { Value = 10 };       // T = int
var strBox = new Box<string> { Value = "hi" };  // T = string
```

**Three big benefits:**
1. **Reusability** — write once, use for every type (`List<int>`, `List<string>`…).
2. **Type safety** — the compiler catches wrong types; no casting.
3. **Performance** — no **boxing** of value types (unlike the old non-generic `ArrayList`).

**💬 Interview tip:** Connect to Step 1's boxing point: *"Generics give me reusable, type-safe code with no boxing. That's why `List<int>` is better than the old `ArrayList`, which boxed every value."*

---

### Q7. What are generic constraints (`where T : …`)?

**Simple answer:** Constraints **restrict** what `T` is allowed to be, so you can safely use its members.

```csharp
// T must be a class that implements IComparable
T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) >= 0 ? a : b;   // allowed because T has CompareTo
```

Common constraints:

| Constraint | Means |
|---|---|
| `where T : class` | T must be a reference type |
| `where T : struct` | T must be a value type |
| `where T : new()` | T must have a parameterless constructor |
| `where T : IComparable` | T must implement that interface/base class |

**💬 Interview tip:** Say *"Constraints let me call specific members on `T` safely. For example `where T : IComparable<T>` means I can call `CompareTo`. Without the constraint the compiler wouldn't allow it."*

---

## 🔴 ADVANCED

### Q8. What are extension methods?

**Simple answer:** An **extension method** lets you add a new method to an **existing type** (even one you didn't write, like `string`) **without modifying or inheriting it**.

Rules: it must be a `static` method, in a `static` class, and the **first parameter uses `this`**.

```csharp
static class StringExtensions
{
    public static bool IsNullOrEmpty(this string? value)
        => string.IsNullOrEmpty(value);
}

string name = "";
bool empty = name.IsNullOrEmpty();   // looks like a built-in method!
```

**Big example you already use:** all of **LINQ** (`Where`, `Select`, `ToList`) is just extension methods on `IEnumerable<T>`.

**💬 Interview tip:** *"Extension methods let me add functionality to types I can't change, like `string` or `IEnumerable`. LINQ itself is built entirely from extension methods on `IEnumerable<T>`."*

---

### Q9. What is a closure (capturing variables in a lambda)?

**Simple answer:** A **closure** happens when a lambda **uses a variable from the surrounding method**. The lambda "captures" that variable and keeps it alive even after the method ends.

```csharp
Func<int> MakeCounter()
{
    int count = 0;                 // local variable
    return () => ++count;          // the lambda CAPTURES 'count'
}

var next = MakeCounter();
Console.WriteLine(next());   // 1
Console.WriteLine(next());   // 2  — 'count' survived between calls!
```

⚠️ **Classic gotcha** — capturing a loop variable:

```csharp
var actions = new List<Action>();
for (int i = 0; i < 3; i++)
    actions.Add(() => Console.WriteLine(i));
// In old C#, all printed 3. Fix: copy into a local — `int local = i;`
```

**💬 Interview tip:** *"A closure is a lambda that captures a variable from its enclosing scope by reference, not by value — so the variable lives as long as the lambda does. I watch out for capturing loop variables."*

---

### Q10. What is covariance and contravariance in generics?

**Simple answer:** They control whether you can use a **more-derived** or **less-derived** type than declared. It's about assignment compatibility of generic types.

- **Covariance (`out`)** → use a **more-derived** type. `IEnumerable<string>` can be assigned to `IEnumerable<object>` (string *is an* object).
- **Contravariance (`in`)** → use a **less-derived** type, used for inputs (e.g. `Action<object>` where `Action<string>` is expected).

```csharp
IEnumerable<string> strings = new List<string> { "a", "b" };
IEnumerable<object> objects = strings;   // ✅ covariance (IEnumerable<out T>)
```

Memory hook: **`out` = covariance (outputs/return)**, **`in` = contravariance (inputs/parameters)**.

**💬 Interview tip:** Keep it simple: *"Covariance (`out`) lets me use a more-derived type — like assigning `IEnumerable<string>` to `IEnumerable<object>`. Contravariance (`in`) is the reverse, for input parameters. I don't define them often, but I rely on them through interfaces like `IEnumerable<out T>`."*

---

### Q11. What is the difference between `Func<T>` and `Expression<Func<T>>`?

**Simple answer:** This is a sharp question that ties straight into **EF Core / LINQ**.

- **`Func<T>`** → **compiled code** you can run immediately (in-memory). Used by **LINQ to Objects**.
- **`Expression<Func<T>>`** → a **data structure describing the code** (an expression tree), not yet executed. EF Core **reads this tree and translates it into SQL**.

```csharp
Func<int, bool> compiled = n => n > 5;          // runnable code
Expression<Func<int, bool>> tree = n => n > 5;  // a tree EF can inspect → SQL
```

That's why `dbContext.Users.Where(u => u.Age > 18)` runs **in the database**: `IQueryable` takes an `Expression`, so EF turns it into a `WHERE` clause instead of pulling every row into memory.

**💬 Interview tip:** *"A `Func` is executable code; an `Expression<Func>` is a tree describing that code. EF Core uses expression trees on `IQueryable` to translate my LINQ into SQL, so the filtering happens in the database, not in C# memory."* (This impresses interviewers.)

---

## 🎬 SCENARIO QUESTIONS

### Scenario 1
> *"When an order is placed, you need to send an email, log it, and update inventory — and more actions may be added later. How do you design this so adding a new action doesn't change existing code?"*

**Model answer:** *"I'd raise an **event** like `OrderPlaced` on the order service. Email, logging, and inventory each subscribe with `+=`. Raising the event notifies all subscribers via the multicast invocation list. Adding a new action later is just one more subscriber — no existing code changes. It's the publisher/subscriber pattern and follows the Open/Closed Principle."*

---

### Scenario 2
> *"You keep writing the same `Repository` code for `Customer`, `Product`, `Order` — only the type changes. How do you remove the duplication?"*

**Model answer:** *"I'd make it **generic**: `Repository<T> where T : class`. One class handles `Add`, `GetById`, `Delete` for any entity, so `Repository<Customer>` and `Repository<Product>` share the same code with full type safety and no casting. The constraint lets me restrict `T` to valid entity types."*

---

### Scenario 3
> *"You have a method that processes a list, but the **filtering rule** changes per caller — sometimes 'active users', sometimes 'users over 18'. How do you avoid writing a separate method each time?"*

**Model answer:** *"I'd pass the rule in as a **`Func<User, bool>`** (or `Predicate<User>`) parameter — passing **behavior as an argument**. Each caller supplies its own lambda: `Process(users, u => u.IsActive)` or `Process(users, u => u.Age > 18)`. One method, many rules. That's exactly how LINQ's `Where` works."*

---

## 📝 QUICK REVISION (last-minute scan)

- **Delegate** = type-safe pointer to a method (store/pass/call behavior).
- **`Action`** = returns void, **`Func`** = returns a value (last type), **`Predicate`** = returns bool.
- **Lambda** `x => x * x` = inline anonymous function; powers LINQ.
- **Event** = a safe delegate; outsiders can only `+=` / `-=`, only the owner can raise it.
- **Multicast delegate** = one delegate holding many methods, run in order.
- **Generics** `T` = reusable, type-safe, no boxing (`List<int>` > `ArrayList`).
- **Constraints** `where T : …` = restrict `T` so you can use its members safely.
- **Extension methods** = add methods to existing types (`this` first param); LINQ is built on them.
- **Closure** = lambda capturing an outer variable by reference (watch loop variables).
- **Covariance `out` / Contravariance `in`** = derived-type compatibility for generics.
- **`Func`** = runnable code; **`Expression<Func>`** = a tree EF Core turns into SQL.

---

## ✅ SELF-CHECK (answer these on your own)

1. Without looking, write the signatures of `Action`, `Func<int,int>`, and `Predicate<string>`.
2. Explain in one sentence why an `event` is safer than exposing a public delegate.
3. Rewrite this duplicated code as a generic method: a `Swap` that swaps two `int`s — make it work for any type.
4. What does a closure capture — the *value* of a variable, or the *variable itself*? Why does it matter?
5. Why does `dbContext.Users.Where(u => u.Age > 18)` run in SQL, but the same `Where` on a `List<User>` runs in memory?

---

🎉 **Done with Step 3?** Tick it in `00-START-HERE.md`, then tell me **"create next step"** to unlock **Step 4 — LINQ & async/await**.
