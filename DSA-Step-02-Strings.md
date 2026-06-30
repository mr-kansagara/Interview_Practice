# DSA Step 2 — Strings 🟧

> **Strings = text.** A name, a sentence, a password — all strings. They show up in a huge number
> of interview questions, and the good news is: **a string is basically an array of characters**, so
> everything you learned in Step 1 (loops, two pointers, Big-O, HashSet) carries straight over.
> We'll go from the basics to real problems, all in **C#**. 👇

---

## PART 0 — String basics for beginners (read this first)

### What is a string, really?

A **string** is a **sequence of characters** in order. Each character (`char`) sits at an **index**, starting at **0** — exactly like an array.

```
 string "HELLO"

 index:   0    1    2    3    4
        +----+----+----+----+----+
 char:  | H  | E  | L  | L  | O  |
        +----+----+----+----+----+
```

```csharp
string s = "HELLO";

Console.WriteLine(s[0]);       // H   (first character)
Console.WriteLine(s[4]);       // O   (last character)
Console.WriteLine(s.Length);   // 5   (number of characters)

for (int i = 0; i < s.Length; i++)   // visit every character
    Console.WriteLine(s[i]);
```

A single character is a **`char`**, written with **single quotes**: `'H'`. A string uses **double quotes**: `"HELLO"`.

---

### The one big rule: strings are immutable

In C#, a string **cannot be changed after it's created** — this is called **immutable**. When you "modify" a string, C# secretly makes a **brand-new** string.

```csharp
string s = "cat";
s = s + "s";   // this does NOT edit "cat" — it creates a new string "cats"
// s[0] = 'b';  // ❌ NOT ALLOWED — you cannot change a character in place
```

**Why this matters for DSA:** building a string by adding to it in a loop creates tons of throwaway copies (slow). When you need to change characters, convert to a **`char[]` array** (which *is* editable) or use a **`StringBuilder`**:

```csharp
char[] chars = s.ToCharArray();   // now editable like a normal array
chars[0] = 'b';
string result = new string(chars); // build a string back from the array
```

> 💬 **Interview tip:** Say *"Strings are immutable in C#, so to modify characters I work on a `char[]` or use a `StringBuilder` to avoid creating a new string on every change."* (This connects back to C# Step 1.)

---

### Handy string tools you'll use

| Tool | What it does | Example |
|---|---|---|
| `s.Length` | number of characters | `"abc".Length` → 3 |
| `s[i]` | the character at index `i` | `"abc"[1]` → `'b'` |
| `s.ToLower()` / `s.ToUpper()` | change case | `"Abc".ToLower()` → `"abc"` |
| `s.ToCharArray()` | turn into an editable `char[]` | — |
| `s.Contains("x")` | is a piece inside? | — |
| `char.IsLetter(c)` / `char.IsDigit(c)` | test a character | `char.IsDigit('5')` → true |

> 🧠 A neat trick: a `char` is also a number under the hood, so `'b' - 'a'` equals `1`. That lets you map `'a'..'z'` to slots `0..25` — handy for counting letters.

---

## PART 1 — String Problems (solved in C#)

> Same format as Step 1: **Problem → Approach (plain English) → C# code → Complexity → Tip.**

---

### Problem 1 (Easy) — Reverse a string

**Problem:** Given `"hello"`, return `"olleh"`.

**Approach — two pointers** (just like reversing an array in Step 1): convert the string to a `char[]`, put one pointer at the start and one at the end, **swap** and move them inward until they meet.

```csharp
string ReverseString(string s)
{
    char[] chars = s.ToCharArray();          // editable copy
    int left = 0, right = chars.Length - 1;
    while (left < right)
    {
        (chars[left], chars[right]) = (chars[right], chars[left]); // swap
        left++;
        right--;
    }
    return new string(chars);                // rebuild the string
}
```

> 🪄 Shortcut you can mention exists: `new string(s.Reverse().ToArray())` using LINQ — but interviewers usually want the manual two-pointer version to see you understand it.

**Complexity:** Time **O(n)**, Space **O(n)** (the char array).

**💬 Interview tip:** *"A string is immutable, so I copy it into a `char[]`, then use two pointers from both ends and swap inward."*

---

### Problem 2 (Easy) — Check if a string is a palindrome

**Problem:** A **palindrome** reads the same forwards and backwards. `"madam"` ✅, `"hello"` ❌.

**Approach — two pointers, but compare instead of swap:** start at both ends. If the two characters ever **differ**, it's not a palindrome. If the pointers meet without any mismatch, it is.

```csharp
bool IsPalindrome(string s)
{
    int left = 0, right = s.Length - 1;
    while (left < right)
    {
        if (s[left] != s[right])   // mismatch → not a palindrome
            return false;
        left++;
        right--;
    }
    return true;
}
```

**Complexity:** Time **O(n)**, Space **O(1)** — we only compare, no extra array needed.

**💬 Interview tip:** Ask the clarifying question: *"Should I ignore spaces and capitalization?"* If yes, clean the string first with `s.ToLower()` and skip non-letters.

---

### Problem 3 (Easy) — Count the vowels in a string

**Problem:** Count how many characters are vowels (`a, e, i, o, u`). `"hello"` → 2.

**Approach:** Walk through each character once. For each one, check if it's a vowel and bump a counter. We lowercase first so `'A'` and `'a'` both count.

```csharp
int CountVowels(string s)
{
    int count = 0;
    foreach (char c in s.ToLower())
    {
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
            count++;
    }
    return count;
}
```

**Complexity:** Time **O(n)**, Space **O(1)**.

**💬 Interview tip:** A cleaner alternative you can mention: *"I could put the vowels in a `HashSet<char>` and check `set.Contains(c)` — it reads nicely and is still O(1) per check."*

---

### Problem 4 (Medium) — Are two strings anagrams?

**Problem:** Two strings are **anagrams** if one is a rearrangement of the other — same letters, same counts, different order. `"listen"` & `"silent"` ✅, `"hello"` & `"world"` ❌.

**Approach — count the letters:** if both strings have the **exact same letter counts**, they're anagrams.
1. Quick check: if lengths differ, they can't be anagrams → return false.
2. Use a **Dictionary** (letter → how many times it appears). **Add** counts for the first string, **subtract** for the second.
3. If everything cancels out to zero, they match.

```csharp
bool AreAnagrams(string a, string b)
{
    if (a.Length != b.Length) return false;   // different size → impossible

    var counts = new Dictionary<char, int>();
    foreach (char c in a)
        counts[c] = counts.GetValueOrDefault(c) + 1;   // count letters in a

    foreach (char c in b)
    {
        if (!counts.ContainsKey(c)) return false;       // letter not in a at all
        counts[c]--;                                    // cancel it out
        if (counts[c] == 0) counts.Remove(c);
    }
    return counts.Count == 0;   // everything cancelled → anagram
}
```

> 🪄 Simpler-to-say alternative: **sort both strings and compare** — `string.Concat(a.OrderBy(c => c)) == string.Concat(b.OrderBy(c => c))`. That's easy to remember but **O(n log n)** because of sorting; the counting version above is **O(n)**.

**Complexity (counting version):** Time **O(n)**, Space **O(n)**.

**💬 Interview tip:** Mention both: *"Sorting both and comparing is the simplest at O(n log n); counting letters with a dictionary is faster at O(n)."*

---

### Problem 5 (Medium) — First non-repeating character

**Problem:** Return the **first** character that appears **exactly once**. `"leetcode"` → `'l'`; `"aabb"` → none.

**Approach — count, then scan:**
1. **First pass:** count how many times each character appears (Dictionary).
2. **Second pass:** walk the string again in order; the **first** character whose count is `1` is the answer. (Scanning the original string again keeps the *order* correct.)

```csharp
char FirstUniqueChar(string s)
{
    var counts = new Dictionary<char, int>();
    foreach (char c in s)
        counts[c] = counts.GetValueOrDefault(c) + 1;   // pass 1: count everything

    foreach (char c in s)                               // pass 2: first count==1 wins
        if (counts[c] == 1)
            return c;

    return '\0';   // '\0' = "none found" (the empty character)
}
```

**Complexity:** Time **O(n)** (two passes is still O(n)), Space **O(n)**.

**💬 Interview tip:** The key insight to say: *"I count first, then re-scan the original string so I return the first unique one in its original order."*

---

## 🧩 PATTERNS TO REMEMBER (from this step)

1. **A string is an array of `char`s** — indexing, `Length`, and loops all work the same way.
2. **Strings are immutable** → convert to `char[]` (or use `StringBuilder`) when you need to change characters.
3. **Two pointers** work on strings too — reversing and palindrome checks are the classic examples.
4. **Counting characters with a Dictionary** (or an `int[26]` for a–z) is the go-to for anagrams, duplicates, and uniqueness — usually turning O(n log n) or O(n²) into **O(n)**.
5. **"Count first, then scan in order"** is a reusable two-pass trick when *order of the answer* matters.

---

## ✅ SELF-PRACTICE (solve on your own, then state the complexity)

1. Check if a string has **all unique characters** (no repeats). *(Hint: HashSet.)*
2. Count how many times **each character** appears and print them.
3. Remove all **spaces** from a string. *(Hint: build the result with a `StringBuilder`.)*
4. Check if two strings are anagrams using the **`int[26]` counting** approach (use `c - 'a'` as the index).
5. Find the **most frequent character** in a string.

> For each one, write down its **time and space complexity** — keep that habit from Step 1 going.

---

🎉 **Done with DSA Step 2?** Tick it in `00-START-HERE.md`, then tell me **"create next DSA step"** to unlock **DSA Step 3 — Searching & Sorting**.
