// https://leetcode.com/problems/find-the-shortest-superstring/solutions/1225975/rust-memoization-with-bitmasks-72-lines/
impl Solution {
  fn common(x: &String, y: &String) -> i32 {
    let a = x.as_bytes();
    let b = y.as_bytes();
    let la = a.len();
    let lb = b.len();
    for k in (1 ..= la.min(lb)).rev() {
      if a[la - k .. la] == b[0 .. k] {
        return k as i32;
      }
    }
    0
  }
  fn f(dp: &mut Vec<Vec<i32>>, a: &Vec<Vec<i32>>, i: usize, m: usize, n: usize) -> i32 {
    if m == 0 { return 0;}
    if dp[i][m] >= 0 { return dp[i][m]; }
    let mut res = -1;
    for j in 0 .. n {
      let bit = 1 << j;
      if (m & bit) == 0 { continue; }
      let w = a[i][j] + Solution::f(dp, a, j, m - bit, n);
      if res < w { res = w; }      
    }
    dp[i][m] = res;
    res
  }
  fn next(dp: &mut Vec<Vec<i32>>, a: &Vec<Vec<i32>>, i: usize, m: usize, n: usize) -> usize {
    let mut res = -1;
    let mut best = n;
    for j in 0 .. n {
      let bit = 1 << j;
      if (m & bit) == 0 { continue; }
      let w = a[i][j] + Solution::f(dp, a, j, m - bit, n);
      if res < w { 
        res = w; 
        best = j;
      }      
    }
    best
  }
  pub fn shortest_superstring(words: Vec<String>) -> String {
    let n = words.len();
    let mut a = Vec::new();
    for i in 0 .. n {
      let mut b = Vec::new();
      for j in 0 .. n {
        b.push(if i == j { 0 } else { Solution::common(&words[i], &words[j])});
      }
      a.push(b);
    }
    let bits = (1 << n) - 1;
    let mut dp = vec![ vec![ -1; 1 << n]; n];
    let mut best = n;
    let mut res = -1;
    for i in 0 .. n {
      let w = Solution::f(&mut dp, &a, i, bits - (1 << i), n);
      if res < w {
        res = w;
        best = i;
      }
    }
    let mut ans = words[best].clone();
    let mut m = bits - (1 << best);
    while m > 0 {
      let j = Solution::next(&mut dp, &a, best, m, n);
      let (_, t) = words[j].split_at(a[best][j] as usize);
      ans.push_str(t);
      best = j;
      m -= 1 << j;
    }
    ans  
  }
}