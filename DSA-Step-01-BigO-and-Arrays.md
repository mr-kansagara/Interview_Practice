# DSA Step 1 — Big-O & Arrays Basics 🟧

> **Why this matters:** Before solving problems, you must be able to say **how fast** and **how
> much memory** your solution uses. That's **Big-O**. Then we practice on **arrays** — the most
> common data structure in coding interviews. All solutions are in **C#**. 👇

---

## PART 1 — Big-O (Time & Space Complexity)

### Q1. What is Big-O notation? Why do interviewers care?

**Simple answer:** Big-O describes **how the work grows as the input grows** — it's a way to measure speed *without* depending on your computer's speed.

Example: if a list has `n` items, does your code do `n` steps? `n²` steps? `log n` steps?

Interviewers care because a solution that works for 10 items might freeze for 10 million items.

**💬 Interview tip:** Always state the complexity *after* you solve a problem: *"This runs in O(n) time and O(1) extra space."* It shows senior-level thinking.

---

### Q2. What are the common Big-O complexities (best → worst)?

| Big-O | Name | Meaning (simple) | Example |
|---|---|---|---|
| **O(1)** | Constant | Same time no matter the size | Access `arr[5]` |
| **O(log n)** | Logarithmic | Halves the work each step | Binary search |
| **O(n)** | Linear | Work grows with input | One loop over an array |
| **O(n log n)** | Linearithmic | Good sorting algorithms | Merge sort, `Array.Sort` |
| **O(n²)** | Quadratic | Loop inside a loop | Comparing every pair |
| **O(2ⁿ)** | Exponential | Doubles each step (very bad) | Naive recursion (Fibonacci) |

> 🧠 Memory trick: **1 < log n < n < n log n < n² < 2ⁿ** (smaller = faster).

**💬 Interview tip:** If you see **nested loops** over the same data → usually **O(n²)**. If you **halve** the search space → **O(log n)**.

---

### Q3. What is Time Complexity vs Space Complexity?

**Simple answer:**
- **Time complexity** = how many *steps/operations* your code does.
- **Space complexity** = how much *extra memory* your code uses (besides the input).

```csharp
// O(n) time (one loop), O(1) space (only one variable)
int Sum(int[] arr)
{
    int total = 0;             // O(1) extra space
    foreach (int x in arr)     // runs n times → O(n) time
        total += x;
    return total;
}
```

**💬 Interview tip:** Interviewers love when you mention the **trade-off**: *"I can make this faster using extra memory (a HashSet), trading space for time."*

---

## PART 2 — Array Problems (solved in C#)

> For each problem: **Problem → Approach (simple English) → C# Solution → Complexity → Tip.**

---

### Problem 1 (Easy) — Find the largest number in an array

**Problem:** Given an array of integers, return the biggest one.

**Approach:** Keep a `max` variable. Walk through once; whenever you see a bigger number, update `max`.

```csharp
int FindMax(int[] arr)
{
    int max = arr[0];
    for (int i = 1; i < arr.Length; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}
```

**Complexity:** Time **O(n)** (one pass), Space **O(1)**.

**💬 Interview tip:** Always ask first: *"Can the array be empty?"* — handling edge cases scores points.

---

### Problem 2 (Easy) — Reverse an array in place

**Problem:** Reverse the array without using extra array memory.

**Approach:** Use **two pointers** — one at the start, one at the end. Swap them, then move both inward until they meet.

```csharp
void Reverse(int[] arr)
{
    int left = 0, right = arr.Length - 1;
    while (left < right)
    {
        (arr[left], arr[right]) = (arr[right], arr[left]); // swap (C# tuple swap)
        left++;
        right--;
    }
}
```

**Complexity:** Time **O(n)**, Space **O(1)** ("in place" = no extra array).

**💬 Interview tip:** Mention *"in place"* — it means O(1) space, which interviewers want.

---

### Problem 3 (Easy) — Check if an array contains a duplicate

**Problem:** Return `true` if any value appears more than once.

**Approach 1 (slow):** Compare every pair → two nested loops → **O(n²)**.
**Approach 2 (smart):** Use a **HashSet**. Add each number; if it's already there, it's a duplicate. This trades a little memory for big speed.

```csharp
bool HasDuplicate(int[] arr)
{
    var seen = new HashSet<int>();
    foreach (int x in arr)
    {
        if (!seen.Add(x))   // .Add returns false if already present
            return true;
    }
    return false;
}
```

**Complexity:** Time **O(n)**, Space **O(n)** (the HashSet).

**💬 Interview tip:** This is the classic **"trade space for time"** answer. Say the brute-force O(n²) first, then improve it to O(n) — interviewers love seeing the optimization.

---

### Problem 4 (Medium) — Two Sum (most asked interview question!)

**Problem:** Given an array and a `target`, return the **indexes** of the two numbers that add up to the target.
Example: `nums = [2, 7, 11, 15], target = 9` → answer `[0, 1]` (because 2 + 7 = 9).

**Approach:** For each number `x`, the partner we need is `target - x`. Use a **Dictionary** that remembers numbers we've already seen and their index. For each number, check if its partner is already in the dictionary.

```csharp
int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>(); // value → index
    for (int i = 0; i < nums.Length; i++)
    {
        int needed = target - nums[i];
        if (seen.ContainsKey(needed))
            return new[] { seen[needed], i };
        seen[nums[i]] = i;   // remember this number
    }
    return Array.Empty<int>(); // no pair found
}
```

**Complexity:** Time **O(n)** (one pass), Space **O(n)** (the dictionary).
*(Brute force with two loops would be O(n²) — mention you avoided that.)*

**💬 Interview tip:** Two Sum is THE most common warm-up. Practice saying: *"Brute force is O(n²); using a hash map I bring it down to O(n) in one pass."*

---

### Problem 5 (Medium) — Move all zeros to the end

**Problem:** `[0, 1, 0, 3, 12]` → `[1, 3, 12, 0, 0]`, keeping the order of non-zeros, in place.

**Approach:** Use a `pos` pointer for the next non-zero slot. Walk through; every non-zero gets placed at `pos` and `pos` moves forward. Fill the rest with zeros.

```csharp
void MoveZeroes(int[] nums)
{
    int pos = 0;
    foreach (int n in nums)
        if (n != 0)
            nums[pos++] = n;        // place non-zeros at the front

    while (pos < nums.Length)
        nums[pos++] = 0;            // fill remaining with zeros
}
```

**Complexity:** Time **O(n)**, Space **O(1)**.

**💬 Interview tip:** This is a **two-pointer / partition** pattern — you'll reuse it a lot. Name the pattern out loud.

---

## 🧩 PATTERNS TO REMEMBER (from this step)

1. **One loop** over data → usually **O(n)**.
2. **Nested loops** over the same data → usually **O(n²)** → ask "can I use a HashSet/Dictionary to make it O(n)?"
3. **Two pointers** (start & end, or slow & fast) → great for reversing, partitioning, in-place work → **O(1) space**.
4. **HashSet / Dictionary** = the #1 trick to turn O(n²) into O(n) (trade space for time).
5. Always state edge cases: empty array, one element, all same, negatives.

---

## ✅ SELF-PRACTICE (solve on your own, then check complexity)

1. Find the **second largest** number in an array. (Hint: one pass, two variables.)
2. Find the **sum of all even numbers** in an array.
3. Given a sorted array, **remove duplicates in place** and return the new length.
4. **Rotate** an array to the right by `k` steps. (Hint: reverse trick.)
5. Find the **missing number** in an array containing `0..n` with one number missing. (Hint: sum formula `n*(n+1)/2`.)

> Try each, then write down its **time and space complexity**. That habit alone wins interviews.

---

🎉 **Done with DSA Step 1?** Tick it in `00-START-HERE.md`, then tell me **"create next DSA step"** to unlock **DSA Step 2 — Strings**.
