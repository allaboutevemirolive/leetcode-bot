// https://leetcode.com/problems/scramble-string/solutions/3358137/rust-dfs-memo-pruning/
use std::collections::HashMap;

impl Solution {
    pub fn is_scramble(s1: String, s2: String) -> bool {
        fn helper(s1: &[usize], s2: &[usize],i:usize, j: usize, k:usize, mem: &mut HashMap<[usize;3],bool>) -> bool {
            if let Some(b) = mem.get(&[i,j,k]) {return *b}
            if s1[i..i+k] == s2[j..j+k] {mem.insert([i,j,k],true); return true}
            let mut m1 = [0_i32;26];
            let mut m2 = [0_i32;26];
            for ind in 1..k {
                m1[s1[i + ind - 1]] += 1;
                m1[s2[j + ind - 1]] -= 1;
                if m1.iter().all(|x| x == &0) &&
                    (ind <= 3 || helper(s1,s2,i,j,ind,mem)) && 
                    helper(s1,s2,i + ind,j + ind,k - ind,mem){
                    mem.insert([i,j,k],true);
                    return true
                }
                m2[s1[i + ind - 1]] += 1;
                m2[s2[j + k - ind]] -= 1;
                if m2.iter().all(|x| *x == 0) && 
                    (ind <= 3 || helper(s1,s2,i,j + k - ind,ind,mem)) &&
                    helper(s1,s2,i + ind,j,k - ind,mem) {
                    mem.insert([i,j,k],true);
                    return true
                }
            }
            mem.insert([i,j,k],false);
            false
        }
        helper(&s1.bytes().map(|c| (c - b'a') as usize).collect::<Vec<_>>(), 
            &s2.bytes().map(|c| (c - b'a') as usize).collect::<Vec<_>>(),
            0,0,s1.len(),
            &mut HashMap::new())
    }
}