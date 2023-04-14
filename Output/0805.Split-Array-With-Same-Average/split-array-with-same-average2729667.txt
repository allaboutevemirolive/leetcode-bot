// https://leetcode.com/problems/split-array-with-same-average/solutions/2729667/rust-translation-hashset-example-explanation-pictures-t-m-100-100/
use std::collections::hash_set::HashSet;

impl Solution {
    pub fn split_array_same_average(mut a: Vec<i32>) -> bool {
        let (la, sa, mut pos, mut neg) = (a.len(), a.iter().sum::<i32>(), Vec::<i32>::new(), Vec::<i32>::new());
        if la == 1 { return false;}

        let norm = a.iter().map(|n| n * la as i32 - sa).collect::<Vec<_>>();
        for &i in &norm {
            match i {
                i if i > 0 => pos.push(i),
                i if i == 0 => { return true; }
                i if i < 0 => neg.push(-i),
                _ => unreachable!(),
            }
        }

        fn mask(arr: &Vec<i32>) -> HashSet<i32> {
            let mut res = HashSet::<i32>::new();
            let sum = arr.iter().sum::<i32>();
            for &i in arr {
                let mut res_n = res.clone();
                res_n.insert(i);
                for s in res.iter() {
                    res_n.insert(s+i);
                }
                res = res_n;
            }
            
            res.remove(&sum);
            res
        }
        
        let (flag_pos, flag_neg) = (mask(&pos), mask(&neg));
        flag_pos.intersection(&flag_neg).next().is_some()
    }
}