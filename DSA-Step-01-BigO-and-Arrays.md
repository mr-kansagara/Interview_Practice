# DSA Step 1 — Getting Started: Big-O & Arrays 🟧

> **Brand new to DSA? You're in the right place.** This step assumes you know **zero** about
> data structures. We'll start from *"what even is an array?"*, learn how to measure if code is
> fast or slow (**Big-O**), and then solve real interview problems — all in **C#**, explained in
> plain English. Read top to bottom, slowly. 👇

---

## PART 0 — DSA for absolute beginners (read this first)

### What is a "data structure" and an "algorithm"?

Two words you'll hear constantly. They're simpler than they sound:

- **Data structure** = a way to **store and organize** data. It's like a *container*.
  *Examples: an array, a list, a dictionary.*
- **Algorithm** = the **step-by-step recipe** you follow to *do something* with that data.
  *Examples: find the biggest number, sort names A→Z, search for a word.*

> 🍳 **Analogy:** A **data structure** is *how books are arranged on your shelf* (by size? by color?).
> An **algorithm** is *the method you use to find a specific book*. Better arrangement + a smarter
> method = you find the book faster. That's the whole game of DSA: **organize data well, then process it efficiently.**

**"DSA" = Data Structures & Algorithms.** That's it. Interviews test both.

---

### What is an Array? (the most basic data structure)

An **array** is a **fixed-size row of boxes**, lined up next to each other, where each box holds one value. Every box has a number called its **index**, and **counting starts at 0** (not 1).

```
 index:   0    1    2    3    4
        +----+----+----+----+----+
 value: | 10 | 20 | 30 | 40 | 50 |
        +----+----+----+----+----+
```

So in the picture above: `arr[0]` is `10`, `arr[2]` is `30`, and the **last** index is `arr[4]` (length is 5, last index is length − 1).

```csharp
int[] arr = { 10, 20, 30, 40, 50 };   // make an array of 5 numbers

Console.WriteLine(arr[0]);      // 10  (first box)
Console.WriteLine(arr[2]);      // 30  (third box)
Console.WriteLine(arr.Length);  // 5   (how many boxes)

arr[1] = 99;                    // change the value in box #1

for (int i = 0; i < arr.Length; i++)   // visit every box
    Console.WriteLine(arr[i]);
```

**Why arrays are special:** the computer knows exactly where each box sits in memory, so jumping straight to `arr[3]` is **instant** — it doesn't have to look through the others. (We'll call this **O(1)**, coming up next.)

> 💬 **Interview tip:** Two facts impress interviewers: *"Array access by index is O(1) because the memory location is calculated directly,"* and *"a basic array has a fixed size — to grow it I'd use a `List<T>` in C#, which resizes for me."*

---

## PART 1 — Big-O (measuring speed & memory)

### Q1. What is Big-O notation? Why do interviewers care?

**Simple answer:** Big-O describes **how the amount of work grows as the input grows**. It's a way to measure speed **without** caring how fast your specific laptop is.

Forget seconds and milliseconds. Instead ask: *"If my array has `n` items, roughly how many steps does my code take?"*
- Does it do about `n` steps? (good)
- Does it do `n × n` steps? (gets slow fast)
- Does it cut the work in half each time? (excellent)

**Why interviewers care:** code that works fine for 10 items can completely freeze for 10 **million** items. Big-O predicts that *before* you run it.

> 🧠 **Key idea:** Big-O is about the **trend as `n` gets huge**, so we drop small details. `2n + 5` steps is just called **O(n)** — we only keep the part that grows the fastest.

**💬 Interview tip:** Always state the complexity *after* you solve a problem: *"This runs in O(n) time and O(1) extra space."* That one sentence signals experience.

---

### Q2. What are the common Big-O complexities (best → worst)?

| Big-O | Name | Meaning (plain English) | Everyday example |
|---|---|---|---|
| **O(1)** | Constant | Same work no matter how big the input | Reading `arr[5]` |
| **O(log n)** | Logarithmic | Throws away half the data each step | Binary search |
| **O(n)** | Linear | Work grows in step with the input | One loop over an array |
| **O(n log n)** | Linearithmic | The speed of *good* sorting | `Array.Sort`, merge sort |
| **O(n²)** | Quadratic | A loop **inside** a loop | Comparing every pair |
| **O(2ⁿ)** | Exponential | Doubles every step (avoid!) | Naive recursive Fibonacci |

> 🧠 **Memory trick (smaller = faster):** **1 < log n < n < n log n < n² < 2ⁿ**

**A feel for the numbers** — if `n = 1,000,000`:
- **O(n)** ≈ 1 million steps → instant.
- **O(n²)** ≈ 1,000,000,000,000 steps (a *trillion*) → your program hangs. This is why turning O(n²) into O(n) matters so much.

**💬 Interview tip:** Two quick rules of thumb: **nested loops over the same data → usually O(n²)**, and **halving the search space each step → O(log n)**.

---

### Q3. What is Time Complexity vs Space Complexity?

**Simple answer:**
- **Time complexity** = how many **steps/operations** your code runs (how *slow*).
- **Space complexity** = how much **extra memory** your code uses *on top of the input* (how *hungry*).

```csharp
// Time: O(n) — the loop runs once per item.
// Space: O(1) — we only ever use ONE extra variable (total), no matter how big arr is.
int Sum(int[] arr)
{
    int total = 0;             // 1 extra variable  → O(1) space
    foreach (int x in arr)     // runs n times       → O(n) time
        total += x;
    return total;
}
```

If instead you copied the array into a new array, that copy would be **O(n) space** (extra memory grows with the input).

**💬 Interview tip:** Interviewers love hearing the **trade-off**: *"I can make this faster by using extra memory — for example a HashSet — trading space for time."* (You'll see exactly this in Problem 3 below.)

---

## PART 2 — Array Problems (solved in C#)

> **How to read each problem:** **Problem → Approach (plain English, step by step) → C# code → Complexity → Tip.**
> Try to picture the solution yourself first, then read on.

---

### Problem 1 (Easy) — Find the largest number in an array

**Problem:** Given an array of integers, return the biggest one.

**Approach (think of it like a competition):**
1. Assume the **first** number is the winner so far → store it in `max`.
2. Walk through the rest one by one. If you find someone **bigger**, they become the new `max`.
3. After visiting everyone, `max` holds the biggest.

```csharp
int FindMax(int[] arr)
{
    int max = arr[0];                       // assume first is the biggest
    for (int i = 1; i < arr.Length; i++)    // check the rest
        if (arr[i] > max)
            max = arr[i];                   // found a bigger one → update
    return max;
}
```

**Dry run** on `[3, 9, 2, 7]`: start `max=3` → see 9 (bigger, `max=9`) → see 2 (no) → see 7 (no) → answer **9**. ✅

**Complexity:** Time **O(n)** (one pass over all items), Space **O(1)** (just the `max` variable).

**💬 Interview tip:** Always ask first: *"Can the array be empty?"* — handling edge cases (empty, one element) earns easy points.

---

### Problem 2 (Easy) — Reverse an array in place

**Problem:** Reverse the array **without** creating a second array. (`[1,2,3,4]` → `[4,3,2,1]`)

**Approach — the "two pointers" technique** (you'll use this constantly):
1. Put one pointer at the **start** (`left`) and one at the **end** (`right`).
2. **Swap** the two values they point at.
3. Move `left` forward and `right` backward.
4. Stop when they meet in the middle.

```csharp
void Reverse(int[] arr)
{
    int left = 0, right = arr.Length - 1;
    while (left < right)
    {
        (arr[left], arr[right]) = (arr[right], arr[left]); // C# one-line swap
        left++;
        right--;
    }
}
```

> 🧠 **"In place"** means we don't use a second array — only O(1) extra memory. Interviewers specifically ask for this.

**Complexity:** Time **O(n)**, Space **O(1)**.

**💬 Interview tip:** Say the pattern name out loud: *"I'll use two pointers from both ends and swap inward."*

---

### Problem 3 (Easy) — Check if an array contains a duplicate

**Problem:** Return `true` if any value appears more than once.

**First, what's a `HashSet`?** It's a data structure that stores items with **no duplicates allowed**, and checking *"is this already in here?"* is **instant — O(1)**. Think of it as a bouncer with a guest list who answers "already inside?" immediately. (We dedicate DSA Step 4 to this idea.)

**Two approaches:**
- **Brute force (slow):** compare every item with every other item → two nested loops → **O(n²)**.
- **Smart (fast):** keep a `HashSet` of numbers you've already seen. For each number, if it's *already* in the set, you found a duplicate. Trades a little memory for big speed.

```csharp
bool HasDuplicate(int[] arr)
{
    var seen = new HashSet<int>();
    foreach (int x in arr)
    {
        if (!seen.Add(x))   // .Add returns FALSE if x was already in the set
            return true;    // → duplicate found
    }
    return false;           // got through everything with no repeats
}
```

**Complexity:** Time **O(n)**, Space **O(n)** (the set can hold up to `n` numbers).

**💬 Interview tip:** This is the classic **"trade space for time"** answer. Say the brute-force O(n²) idea first, *then* improve it to O(n) — showing the optimization is exactly what interviewers want.

---

### Problem 4 (Medium) — Two Sum (the most-asked interview question!)

**Problem:** Given an array and a `target`, return the **indexes** of the two numbers that add up to the target.
Example: `nums = [2, 7, 11, 15]`, `target = 9` → answer `[0, 1]` (because `2 + 7 = 9`).

**Approach — "remember what you've seen":** For each number `x`, the partner we need is `target − x`. As we walk the array, we keep a **Dictionary** (a lookup table of *value → its index*). For each number, we first check: *"have I already seen the partner I need?"*
- If **yes** → return both indexes.
- If **no** → remember the current number and move on.

```csharp
int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>(); // number → index we saw it at
    for (int i = 0; i < nums.Length; i++)
    {
        int needed = target - nums[i];      // the partner that completes the target
        if (seen.ContainsKey(needed))
            return new[] { seen[needed], i };
        seen[nums[i]] = i;                  // remember this number + its index
    }
    return Array.Empty<int>();              // no valid pair
}
```

**Dry run** on `[2,7,11,15]`, target 9: at i=0, num=2, need 7 → not seen, remember {2→0}. At i=1, num=7, need 2 → **seen!** return `[0,1]`. ✅

**Complexity:** Time **O(n)** (one pass), Space **O(n)** (the dictionary). *(Brute force with two loops is O(n²) — mention you avoided it.)*

**💬 Interview tip:** Practice this line: *"Brute force is O(n²); using a hash map to remember seen values, I bring it down to O(n) in a single pass."*

---

### Problem 5 (Medium) — Move all zeros to the end

**Problem:** `[0, 1, 0, 3, 12]` → `[1, 3, 12, 0, 0]`. Keep the order of the non-zeros, and do it **in place**.

**Approach — a "writing pointer":** Keep a pointer `pos` that marks *where the next non-zero should go*.
1. Walk through the array. Every time you hit a **non-zero**, write it at `pos` and bump `pos` forward.
2. After that, everything from `pos` to the end should be **zeros** — fill them in.

```csharp
void MoveZeroes(int[] nums)
{
    int pos = 0;
    foreach (int n in nums)
        if (n != 0)
            nums[pos++] = n;        // place each non-zero at the front, in order

    while (pos < nums.Length)
        nums[pos++] = 0;            // fill the remaining slots with zeros
}
```

**Complexity:** Time **O(n)**, Space **O(1)**.

**💬 Interview tip:** This is the **two-pointer / partition** pattern (a slow "write" pointer + a fast "read" pointer). Name it out loud — you'll reuse it in many problems.

---

## 🧩 PATTERNS TO REMEMBER (from this step)

1. **One loop** over the data → usually **O(n)**.
2. **Nested loops** over the same data → usually **O(n²)** → immediately ask *"can a HashSet/Dictionary make this O(n)?"*
3. **Two pointers** (start & end, or a slow "write" + fast "read") → great for reversing, partitioning, and any **in-place** work → **O(1) space**.
4. **HashSet / Dictionary** = the #1 trick to turn **O(n²) into O(n)** (trade space for time).
5. Always mention **edge cases**: empty array, one element, all-same values, negatives.

---

## ✅ SELF-PRACTICE (solve on your own, then state the complexity)

1. Find the **second largest** number in an array. *(Hint: one pass, two variables.)*
2. Find the **sum of all even numbers** in an array.
3. Given a **sorted** array, **remove duplicates in place** and return the new length. *(Hint: two pointers.)*
4. **Rotate** an array to the right by `k` steps. *(Hint: reverse the whole thing, then reverse the two parts.)*
5. Find the **missing number** in an array containing `0..n` with exactly one number missing. *(Hint: the sum `0+1+…+n` is `n*(n+1)/2`.)*

> For each one, write down its **time and space complexity**. Building that habit now is what wins interviews later.

---

🎉 **Done with DSA Step 1?** Tick it in `00-START-HERE.md`, then tell me **"create next DSA step"** to unlock **DSA Step 2 — Strings**.
