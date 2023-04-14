// https://leetcode.com/problems/largest-component-size-by-common-factor/solutions/2728266/rust-union-find-using-sieve-of-eratosthenes-algorithm/
use std::collections::HashMap;

impl Solution {
    pub fn largest_component_size(nums: Vec<i32>) -> i32 {
        let hash: HashMap<i32, usize> = nums.iter().enumerate()
            .map(|(i, &x)| (x, i))
            .collect();
        let mut parent: Vec<usize> = (0..nums.len()).collect();
        let mut size: Vec<i32> = vec![1; nums.len()];
        let largest = *nums.iter().max().unwrap() as usize;
        let mut sieve = vec![true; largest + 1];
        for p in 2..=largest / 2 {
            if sieve[p] {
                let mut i = nums.len();
                for x in (p..=largest).step_by(p) {
                    sieve[x] = false;
                    if let Some(&j) = hash.get(&(x as i32)) {
                        if i == nums.len() {
                            i = j;
                        }
                        else {
                            Self::union_by_size(i, j, &mut parent, &mut size);
                        }
                    }
                }
            }
        }
        *size.iter().max().unwrap()
    }
    
    fn find_set(x: usize, parent: &mut Vec<usize>) -> usize {
        if x != parent[x] {
            parent[x] = Self::find_set(parent[x], parent);
        }
        parent[x]
    }

    fn union_by_size(x: usize, y: usize, parent: &mut Vec<usize>, size: &mut Vec<i32>) {
        let mut x2 = Self::find_set(x, parent);
        let mut y2 = Self::find_set(y, parent);
        if x2 != y2 {
            if size[x2] < size[y2] {
                std::mem::swap(&mut x2, &mut y2);
            }
            parent[y2] = x2;
            size[x2] += size[y2];
        }
    }
}