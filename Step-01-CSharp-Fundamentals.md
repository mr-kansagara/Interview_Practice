# Step 1 — C# Fundamentals 🟢

> **Why this matters:** Almost every .NET interview *starts* here. These are the warm-up
> questions interviewers use to check if your basics are solid. Getting these right builds
> instant trust. Read slowly, line by line. 👇

---

## 🟢 BASIC

### Q1. What is C# and what is .NET? Are they the same thing?

**Simple answer:**
- **C#** is a *programming language* (the words and grammar you write code in).
- **.NET** is a *platform/framework* (the engine + tools + libraries that run your C# code).

Think of it like this: **C# is the language you speak; .NET is the country where that language runs.**

- `.NET Framework` → old, Windows-only.
- `.NET Core` / `.NET 5/6/7/8` → modern, **cross-platform** (Windows, Linux, Mac), faster, open-source. This is what you use in your jobs.

**💬 Interview tip:** Say *"C# is the language, .NET is the runtime and libraries that execute it. I work mostly with .NET Core / .NET 8 because it's cross-platform and high-performance."*

---

### Q2. What is the difference between Value Types and Reference Types?

**Simple answer:** This is the #1 most-asked C# fundamentals question. Learn it well.

| | Value Type | Reference Type |
|---|---|---|
| Stores | The **actual value** | A **reference (address)** to the value |
| Memory | Usually **Stack** | Object on **Heap**, reference on Stack |
| Examples | `int`, `double`, `bool`, `char`, `struct`, `enum` | `class`, `string`, `array`, `object`, `interface`, `delegate` |
| When copied | A **full copy** is made | Only the **address** is copied (both point to same object) |

```csharp
// Value type — copy is independent
int a = 10;
int b = a;   // b gets its OWN copy
b = 20;
// a is still 10, b is 20

// Reference type — both point to the SAME object
int[] arr1 = { 1, 2, 3 };
int[] arr2 = arr1;   // arr2 points to the SAME array
arr2[0] = 99;
// arr1[0] is now also 99!
```

**💬 Interview tip:** Give the copy example. Say *"Value types copy the actual data, so changes don't affect the original. Reference types copy only the address, so both variables share the same object."*

---

### Q3. What is the difference between Stack and Heap memory?

**Simple answer:**
- **Stack** = fast, small, organized. Stores value types and the *references* (addresses) of objects. Cleaned up automatically when a method ends.
- **Heap** = bigger, slower. Stores the actual objects (reference types). Cleaned up by the **Garbage Collector (GC)**.

> Simple picture: Stack is like a stack of plates (last in, first out, quick). Heap is like a big warehouse where objects live until the GC removes them.

**💬 Interview tip:** Connect it to Q2 — *"Value types live on the stack, reference type objects live on the heap, and the garbage collector frees heap memory automatically so I don't manage memory manually."*

---

### Q4. What is the difference between `var`, `const`, and `readonly`?

**Simple answer:**

```csharp
var name = "Raj";        // compiler figures out the type (string). Type is FIXED after that.
const int MaxUsers = 100; // value set at COMPILE time, can NEVER change. Must set when declared.
readonly int _id;         // value set ONCE, at declaration OR in the constructor. Then locked.
```

- `var` → just lets the compiler guess the type. It's still strongly typed (`name` is always a string).
- `const` → a true constant, baked in at compile time. Use for values that never change (e.g. `Pi`).
- `readonly` → can be set at runtime (in constructor), useful when the value depends on something at startup.

**💬 Interview tip:** Key line: *"`const` is compile-time and global; `readonly` is run-time and can be set in the constructor, so it's more flexible."*

---

### Q5. What is the difference between `==` and `.Equals()`?

**Simple answer:**
- For **value types** → both compare the actual values. Same result.
- For **reference types** → `==` (by default) checks if they're the **same object in memory**; `.Equals()` can be overridden to compare the **content**.
- **`string` is special:** both `==` and `.Equals()` compare the **text/content** (because string overrides them).

```csharp
string x = "hello";
string y = "hello";
Console.WriteLine(x == y);        // True (compares text)
Console.WriteLine(x.Equals(y));   // True (compares text)
```

**💬 Interview tip:** Mention that *"`string` overrides `==` to compare content, which surprises people because it's a reference type."*

---

## 🟡 INTERMEDIATE

### Q6. Why are strings immutable in C#? What is `StringBuilder`?

**Simple answer:**
- **Immutable** = once a string is created, it **cannot be changed**. Every time you "modify" a string, C# actually creates a **brand new string** in memory.

```csharp
string s = "Hello";
s += " World";   // does NOT change "Hello" — creates a NEW string "Hello World"
```

- This is wasteful if you do it many times (like in a loop) — lots of garbage strings.
- **`StringBuilder`** solves this. It's **mutable** — you change the same object instead of creating new ones. Use it when building strings in loops.

```csharp
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
    sb.Append(i);       // efficient — no new string each time
string result = sb.ToString();
```

**💬 Interview tip:** Rule of thumb: *"For a few concatenations, normal string is fine. For many (especially in loops), I use StringBuilder to avoid creating thousands of temporary string objects."*

---

### Q7. What is Boxing and Unboxing?

**Simple answer:**
- **Boxing** = converting a **value type** (like `int`) into a **reference type** (`object`). The value gets "boxed" and moved to the heap.
- **Unboxing** = taking it back out into a value type.

```csharp
int num = 10;
object boxed = num;     // BOXING (int → object, goes to heap)
int back = (int)boxed;  // UNBOXING (object → int)
```

- **Why care?** Boxing/unboxing is **slow** (extra memory + heap work). Modern code avoids it using **generics** (e.g. `List<int>` instead of old `ArrayList`).

**💬 Interview tip:** Say *"Boxing has a performance cost, so I use generic collections like `List<int>` instead of non-generic ones like `ArrayList`, which box every value."*

---

### Q8. What are Nullable types and how do you handle null safely?

**Simple answer:**
- Value types (like `int`) normally **cannot be null**. To allow null, add `?`:

```csharp
int? age = null;        // nullable int — allowed
int normalAge = null;   // ❌ ERROR — not allowed
```

- Handy null operators:

```csharp
int result = age ?? 0;        // ?? "null-coalescing": if age is null, use 0
int? len = user?.Name?.Length; // ?. "null-conditional": stop if anything is null (no crash)
```

- A `NullReferenceException` is the most common runtime crash in .NET — these operators prevent it.

**💬 Interview tip:** Mention `?.` and `??` by name. Say *"I use the null-conditional `?.` and null-coalescing `??` operators to write safe code and avoid NullReferenceException."*

---

## 🔴 ADVANCED

### Q9. What is the difference between `string` and `String`? And `int` vs `Int32`?

**Simple answer:** They are **exactly the same thing**. 
- `string` is a C# **keyword (alias)** for `System.String`.
- `int` is an alias for `System.Int32`.

```csharp
string a = "hi";   // same as:
String b = "hi";
```

Convention: use lowercase (`string`, `int`) for variables; the framework types (`Int32`) are just the underlying .NET names.

**💬 Interview tip:** Quick confident answer: *"They're identical — `string` is just a C# alias for `System.String`. I use the lowercase aliases by convention."*

---

### Q10. How does Garbage Collection work in C#? Do we manage memory manually?

**Simple answer:**
- **No**, C# manages memory for you. The **Garbage Collector (GC)** automatically frees objects on the **heap** that are no longer used (nothing references them).
- It works in **generations** (Gen 0, 1, 2): new objects start in Gen 0; ones that survive longer move up. This makes cleanup efficient.
- For unmanaged resources (files, DB connections), you use `IDisposable` + `using` to release them deterministically:

```csharp
using (var connection = new SqlConnection(connString))
{
    // use it...
} // connection is automatically closed/disposed here
```

**💬 Interview tip:** Say *"The GC handles managed memory automatically. For unmanaged resources like DB connections or file handles, I use `using` / `IDisposable` to release them promptly."* This shows real-world maturity.

---

### Q11. What is the difference between `ref`, `out`, and passing by value?

**Simple answer:**
- **By value (default):** the method gets a *copy*. Changes inside don't affect the original.
- **`ref`:** passes the *actual variable*. Must be initialized **before** passing. Method can change it.
- **`out`:** like `ref`, but the variable does **not** need a value before; the method **must** assign it.

```csharp
void Square(ref int x) { x = x * x; }
int n = 5;
Square(ref n);   // n becomes 25

bool ok = int.TryParse("123", out int value); // classic 'out' example
```

**💬 Interview tip:** `out` is best known from `int.TryParse`. Say *"`out` is great for returning multiple values or a success-flag-plus-result pattern, like `TryParse`."*

---

## 🎬 SCENARIO QUESTIONS

### Scenario 1
> *"You have a loop that builds a long report string by concatenating 10,000 rows. The app is slow and using lots of memory. What's wrong and how do you fix it?"*

**Model answer:** *"String concatenation in a loop creates a new string object every iteration because strings are immutable — that's 10,000 throwaway objects, which pressures the garbage collector and slows things down. I'd switch to `StringBuilder`, which mutates one buffer instead of creating new strings each time."*

---

### Scenario 2
> *"Your app crashes with a `NullReferenceException` when reading `customer.Address.City`. How do you prevent it?"*

**Model answer:** *"That happens when `customer` or `Address` is null. I'd use the null-conditional operator: `customer?.Address?.City`, which safely returns null instead of crashing, and combine it with `??` to provide a default — e.g. `customer?.Address?.City ?? "Unknown"`."*

---

### Scenario 3
> *"You pass an object to a method, the method changes a property, and the change is visible outside the method. But when you pass an `int` and change it, the change is NOT visible. Why?"*

**Model answer:** *"Objects are reference types — the method receives a copy of the reference, but it points to the same object on the heap, so property changes are visible. An `int` is a value type, so the method gets an independent copy; changes stay local unless I pass it with `ref`."*

---

## 📝 QUICK REVISION (last-minute scan)

- **C#** = language, **.NET** = platform/runtime.
- **Value types** copy data (stack); **reference types** share the object (heap).
- **GC** frees heap memory automatically; use `using` for DB/file resources.
- `const` = compile-time, fixed forever; `readonly` = set once at runtime/constructor.
- **Strings are immutable** → use **StringBuilder** for many changes.
- **Boxing** (value→object) is slow → prefer **generics**.
- Use `?` for nullable value types; `?.` and `??` for safe null handling.
- `string`==`System.String`, `int`==`System.Int32` (just aliases).
- `ref` (must init first) and `out` (method must assign) pass by reference.

---

## ✅ SELF-CHECK (answer these on your own)

1. Without looking, list 3 value types and 3 reference types.
2. What actually happens in memory when you write `string s = "a"; s += "b";`?
3. When would you choose `readonly` over `const`? Give a real example.
4. Why is `List<int>` better than `ArrayList` for storing numbers?
5. Rewrite this safely: `var city = order.Customer.Address.City;`

---

🎉 **Done with Step 1?** Tick it in `00-START-HERE.md`, then tell me **"create next step"** to unlock **Step 2 — OOP in C#**.
