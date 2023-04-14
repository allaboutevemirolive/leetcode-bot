// https://leetcode.com/problems/permutation-sequence/solutions/1941429/rust-impl/
use std::collections::BTreeSet;

impl Solution {
    fn fact(n: i32) -> i32 {
        (1..=n).fold(1, |acc, x| acc*x)
    }
    fn permute(comb_remain: i32, mut s: BTreeSet<i32>, target_perm: i32, mut ret: Vec<i32>) -> Vec<i32> {
        if s.len()==0{
            return ret
        }
        let comb_current = s.len() as i32;
        let comb_remain_new = comb_remain / comb_current;
        let idx = target_perm / comb_remain_new;
        let val = *s.iter().nth(idx as usize).expect("idx out of range");
        s.remove(&val);
        ret.push(val);
        Solution::permute(comb_remain_new, s, target_perm % comb_remain_new, ret)
    }
    pub fn get_permutation(n: i32, k: i32) -> String {
        let mut hs : BTreeSet<i32> = (1..=n).collect();
        let ret = Solution::permute(Solution::fact(n), hs, k-1, Vec::new());
        ret.into_iter().map(|x| (x as u8 + '0' as u8) as char).collect()
    }
}