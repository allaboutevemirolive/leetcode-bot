// https://leetcode.com/problems/largest-component-size-by-common-factor/solutions/2204971/rust-solution-using-union-find/
use std::collections::*;

fn size(parents: &mut Vec<isize>, i: isize) -> isize {
  let ii = find(parents, i) as usize;
  -1 * parents[ii]
}

fn find(parents: &mut Vec<isize>, i: isize) -> isize {
  let ii = i as usize;
  if parents[ii] < 0 {
    i
  } else {
    parents[ii] = find(parents, parents[ii]);
    parents[ii]
  }
}

fn connect(
  parents: &mut Vec<isize>,
  a: isize,
  b: isize
) -> bool {
  let mut pa = find(parents, a);
  let mut pb = find(parents, b);
  
  if pa == pb { return false }
  
  if size(parents, pa) < size(parents, pb) {
    let temp = pa;
    pa = pb;
    pb = temp;
  }
  
  let paa = pa as usize;
  let pbb = pb as usize;
  parents[paa] += parents[pbb];
  parents[pbb] = pa;
  
  true
}

fn sieve() -> HashSet<i32> {
  let a = 100000 / 2 + 1;
  let mut is_prime = vec![true;a+1];
  let mut set = HashSet::new();
  for i in 2..=a {
    if is_prime[i] {
      is_prime[i] = false;
      set.insert(i as i32);
      for j in 2..=a/i {
        is_prime[i * j] = false;
      }
    }
  }
  set
}

impl Solution {
    pub fn largest_component_size(nums: Vec<i32>) -> i32 {
    let n = nums.len();
    let mut parents = vec![-1;n];

    let limit = 100000;
    let mut memo = vec![None;limit+1];

    for i in 0..n {
        memo[nums[i] as usize] = Some(i);
    }

    let mut is_prime = vec![true;limit+1];
    for i in 2..=limit {
        let mut temp = None;
        if is_prime[i] {
        is_prime[i] = false;
        for j in 1..=limit/i {
            let ni = i * j;
            is_prime[ni] = false;

            if let Some(ai) = memo[ni] {
            if let Some(bi) = temp {
                connect(&mut parents, ai as isize, bi as isize);
            } else {
                temp = Some(ai);
            }
            }

        }
        }
    }

    let mut result = 0;
    for i in 0..n {
        result = std::cmp::max(result, size(&mut parents, i as isize));
    }
    result as i32
    }
}