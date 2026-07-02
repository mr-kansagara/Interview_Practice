# DSA Step 3 — Searching & Sorting 🟧

> **Two of the most useful skills in all of programming.** *Searching* = **finding** an item in a
> collection. *Sorting* = **putting items in order**. They matter because a huge number of harder
> problems become easy *once the data is sorted*, and because **binary search** — the star of this
> step — is one of the most-loved interview topics. Everything here builds on arrays (Step 1) and the
> two-pointer idea you already know. All in **C#**. 👇

---

## PART 0 — The big ideas (read this first)

### Searching: linear vs binary (why order changes everything)

Imagine finding a name in a list.

- **Linear search** = start at the top and check every entry one by one. Works on **any** list. Slow for big lists: **O(n)**.
- **Binary search** = the phone-book trick: open the **middle**, decide if your target is in the **left half** or **right half**, throw the other half away, repeat. Blazing fast: **O(log n)** — but it **only works if the list is already sorted**.

```
Find 7 in a SORTED array with binary search:

 [ 1 , 3 , 5 , 7 , 9 , 11 , 13 ]
   0   1   2   3   4    5    6
               ^mid=3 → value 7 → found in ONE look!

Find 11:
   mid=3 → 7 < 11, so look RIGHT half →
 [ 9 , 11 , 13 ]  mid → 11 → found.
```

> 🧠 **Why "log n" is amazing:** each step throws away *half* the remaining items. A list of 1,000,000 items takes only about **20** steps. That's the whole reason we bother sorting things.

---

### Sorting: what it means, and the golden rule

**Sorting** rearranges items into order (smallest→largest, A→Z, …). You'll learn the *mechanics* by writing a simple sort by hand — but remember:

> 🪄 **In real code, you almost never write your own sort.** C# gives you `Array.Sort(arr)` and LINQ's `list.OrderBy(x => x)`, which are **O(n log n)** and highly optimized. We learn manual sorts to *understand* them and to answer interview questions — not to use them in production.

```csharp
int[] nums = { 5, 2, 8, 1 };

Array.Sort(nums);                         // in place → { 1, 2, 5, 8 }
var sorted = nums.OrderBy(n => n).ToList();// LINQ → new sorted list
var desc   = nums.OrderByDescending(n => n).ToList();
```

**Speed cheat-sheet for this step:**

| Technique | Time | Needs sorted input? |
|---|---|---|
| Linear search | O(n) | ❌ no |
| Binary search | **O(log n)** | ✅ **yes** |
| Bubble / Selection sort | O(n²) | — (they *do* the sorting) |
| Built-in `Array.Sort` / `OrderBy` | O(n log n) | — |

---

## PART 1 — Problems (solved in C#)

> Same format as before: **Problem → Approach (plain English) → C# code → Complexity → Tip.**

---

### Problem 1 (Easy) — Linear Search

**Problem:** Given an array and a `target`, return the **index** of the target, or `-1` if it's not there. Works on **any** array (sorted or not).

**Approach:** Walk through every element from left to right. The moment `arr[i]` equals the target, return `i`. If the loop finishes with no match, return `-1`.

```csharp
int LinearSearch(int[] arr, int target)
{
    for (int i = 0; i < arr.Length; i++)
    {
        if (arr[i] == target)   // found it
            return i;
    }
    return -1;                  // never found
}
```

**Complexity:** Time **O(n)** (worst case: check every item), Space **O(1)**.

**💬 Interview tip:** *"Linear search is the baseline — O(n), works on unsorted data. I reach for it when the data is small or unsorted; if it's sorted and I'll search often, binary search is far better."*

---

### Problem 2 (Easy) — Binary Search ⭐

**Problem:** Given a **sorted** array and a `target`, return its index (or `-1`). This is the single most important problem in this step.

**Approach — halve the search range each step:** keep two pointers, `left` and `right`, marking the range still worth checking. Look at the **middle**:
- If `arr[mid]` **is** the target → done.
- If `arr[mid]` is **too small** → the answer must be to the **right**, so move `left = mid + 1`.
- If `arr[mid]` is **too big** → move `right = mid - 1`.

Repeat until the pointers cross.

```csharp
int BinarySearch(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1;

    while (left <= right)               // while the range is still valid
    {
        int mid = left + (right - left) / 2;   // safe midpoint (avoids overflow)

        if (arr[mid] == target)         // hit
            return mid;
        else if (arr[mid] < target)     // target is bigger → search right half
            left = mid + 1;
        else                            // target is smaller → search left half
            right = mid - 1;
    }
    return -1;                          // pointers crossed → not found
}
```

> ⚠️ **Two classic bugs to avoid:**
> 1. Write `mid = left + (right - left) / 2`, **not** `(left + right) / 2` — the latter can *overflow* for huge indexes.
> 2. The loop condition is `left <= right` (with `<=`). Using `<` misses the case where the target is the last remaining single element.

**Complexity:** Time **O(log n)** (halves the range each step), Space **O(1)**.

**💬 Interview tip:** *"Binary search needs a sorted array. I track a `left`/`right` range, check the middle, and discard the half that can't contain the target. It's O(log n). The two things I'm careful about are the overflow-safe midpoint and the `left <= right` condition."*

---

### Problem 3 (Easy) — Bubble Sort (learn how sorting works)

**Problem:** Sort an array from smallest to largest **by hand** (no built-in sort), to understand the mechanics.

**Approach — repeatedly swap out-of-order neighbours:** walk the array comparing each pair of **adjacent** items; if they're in the wrong order, **swap** them. After one full pass the largest value has "**bubbled**" to the end. Repeat for the rest. If a pass makes **no swaps**, it's already sorted → stop early.

```csharp
void BubbleSort(int[] arr)
{
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++)          // number of passes
    {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++)  // last i items are already in place
        {
            if (arr[j] > arr[j + 1])         // wrong order → swap neighbours
            {
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                swapped = true;
            }
        }
        if (!swapped) break;                 // no swaps → already sorted, stop
    }
}
```

**Complexity:** Time **O(n²)** (a loop inside a loop), Space **O(1)**. The early-exit makes it **O(n)** on an already-sorted array.

**💬 Interview tip:** *"Bubble sort repeatedly swaps adjacent out-of-order pairs until sorted — O(n²), so I'd never use it in production. But it's great for explaining how sorting works, and the 'no swaps this pass → stop' optimization shows I'm thinking about best cases. In real code I'd call `Array.Sort`, which is O(n log n)."*

---

### Problem 4 (Medium) — Merge Two Sorted Arrays

**Problem:** Given two **already-sorted** arrays, combine them into **one sorted** array. e.g. `[1,3,5]` + `[2,4,6]` → `[1,2,3,4,5,6]`. (This "merge" step is the heart of **merge sort**.)

**Approach — two pointers, one per array:** put a pointer at the start of each array. Compare the two current elements, copy the **smaller** one into the result, and advance **that** pointer. When one array runs out, copy whatever's left of the other.

```csharp
int[] MergeSorted(int[] a, int[] b)
{
    int[] result = new int[a.Length + b.Length];
    int i = 0, j = 0, k = 0;          // i→a, j→b, k→result

    while (i < a.Length && j < b.Length)
    {
        if (a[i] <= b[j])             // a's item is smaller (or equal) → take it
            result[k++] = a[i++];
        else                          // b's item is smaller → take it
            result[k++] = b[j++];
    }

    while (i < a.Length) result[k++] = a[i++];   // copy any leftovers from a
    while (j < b.Length) result[k++] = b[j++];   // copy any leftovers from b

    return result;
}
```

**Complexity:** Time **O(n + m)** (each item copied once), Space **O(n + m)** for the result.

**💬 Interview tip:** *"Because both inputs are already sorted, I don't need to re-sort — I merge with two pointers, always taking the smaller front element, in O(n + m). This merge is exactly the combine step of merge sort."*

---

### Problem 5 (Medium) — Search Insert Position

**Problem:** Given a **sorted** array and a target, return the index of the target if present — otherwise the index **where it should be inserted** to keep the array sorted. e.g. `[1,3,5,6]`, target `4` → `2` (it belongs between 3 and 5).

**Approach — binary search with a twist:** it's the same binary search as Problem 2, but instead of returning `-1` when not found, we return `left`. The neat insight: **when the loop ends, `left` is exactly the position where the target *would* go.** That's why binary search is so reusable.

```csharp
int SearchInsert(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
            return mid;               // found exactly
        else if (arr[mid] < target)
            left = mid + 1;           // go right
        else
            right = mid - 1;          // go left
    }
    return left;   // 👈 not found: 'left' is where it should be inserted
}
```

Why does `left` land on the right spot? Every time the middle is too small we push `left` past it, and every time it's too big we pull `right` in — so when they cross, `left` sits at the first position holding a value **≥ target**, which is exactly where the target belongs.

**Complexity:** Time **O(log n)**, Space **O(1)** — same as plain binary search.

**💬 Interview tip:** *"It's binary search, but I return `left` instead of `-1`. When the loop ends, `left` is the first index whose value is ≥ the target — the correct insert position. Understanding what `left` means at the end is what makes binary search adaptable to lots of variants."*

---

## 🧩 PATTERNS TO REMEMBER (from this step)

1. **Sorted data unlocks binary search** — O(log n) instead of O(n). If you're told an array is sorted, an interviewer is *hinting* at binary search.
2. **Binary search template:** `left`/`right` range, `mid = left + (right - left) / 2`, discard half each step, loop `while (left <= right)`.
3. **What `left` means at the end** — the insert position. This one idea powers many binary-search variants (insert position, first/last occurrence, "search on the answer").
4. **Two pointers merge two sorted lists** in O(n + m) — the core of merge sort.
5. **Know the costs:** linear search O(n), binary search O(log n), simple sorts O(n²), built-in sorts O(n log n). In production, **use `Array.Sort` / `OrderBy`** — write manual sorts only to explain them.

---

## ✅ SELF-PRACTICE (solve on your own, then state the complexity)

1. Write **binary search recursively** (a method that calls itself on the half-range) instead of with a loop.
2. In a sorted array with duplicates, find the **first** index where `target` appears. *(Hint: when you find it, keep searching left.)*
3. Implement **Selection Sort**: repeatedly find the smallest remaining item and put it at the front. What's its Big-O?
4. Given a sorted array, count how many elements are **less than** a given value. *(Hint: it's the insert position from Problem 5.)*
5. Use `Array.Sort` first, then find whether **any two numbers add up to a target**. What does sorting let you do afterward? *(Preview of Step 5: two pointers.)*

> For each one, write down its **time and space complexity** — keep that habit going.

---

🎉 **Done with DSA Step 3?** Tick it in `00-START-HERE.md`, then tell me **"create next DSA step"** to unlock **DSA Step 4 — Hashing (`Dictionary` & `HashSet`)**.
