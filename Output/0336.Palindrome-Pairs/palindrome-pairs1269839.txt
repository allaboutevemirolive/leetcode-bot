// https://leetcode.com/problems/palindrome-pairs/solutions/1269839/rust-56ms-solution/
use std::collections::HashMap;

fn reverse(s: &String) -> String {
  let mut t = String::new();
  for c in s.chars().rev() {
    t.push(c);
  }
  t
}

fn is_palindrom(dp: &mut Vec<Vec<i8>>, b: &[u8], i: usize, j: usize) -> bool {
  if j <= i + 1 { true }
  else if dp[i][j] != 0 {
    dp[i][j] == 1
  } else {
    if b[i] == b[j-1] && is_palindrom(dp, b, i + 1, j - 1) {
      dp[i][j] = 1;
      true
    } else {
      dp[i][j] = 0;
      false
    }
  }
}

impl Solution {
  pub fn palindrome_pairs(words: Vec<String>) -> Vec<Vec<i32>> {
    let n = words.len();
    let rwords = words.iter().map(|t| reverse(t)).collect::<Vec<_>>();
    let h = rwords.into_iter().zip(0 .. n as i32).collect::<HashMap<_,_>>();
    let mut res = Vec::new();
    for (i, s) in words.into_iter().enumerate() {
      let b = s.as_bytes();
      let m = b.len();
      let mut dp = vec![ vec![0; m + 1]; m]; 
      if let Some(q) = h.get(&s) {
        if i as i32 != *q {
          res.push(vec![*q, i as i32]);
        }
      }              
      for j in 0 ..= m {        
        if j < m && is_palindrom(&mut dp, b, j, m) {
          let t = std::str::from_utf8(&b[0 .. j]).unwrap().to_string();
          if let Some(q) = h.get(&t) {
            if i as i32 != *q {
              res.push(vec![i as i32, *q]);
            }
          }
        }
        if j > 0 && is_palindrom(&mut dp, b, 0, j) {
          let t = std::str::from_utf8(&b[j .. ]).unwrap().to_string();
          if let Some(q) = h.get(&t) {
            if i as i32 != *q {
              res.push(vec![*q, i as i32]);
            }
          }        
        }        
      }
    }
    res
  }
}