// https://leetcode.com/problems/distinct-subsequences/solutions/1350928/rust-solution-based-on-btreemap-0ms-2mb/
use std::collections::BTreeMap;
impl Solution {
    pub fn num_distinct(s: String, t: String) -> i32 {
        if s.len()==t.len(){
            if s==t{
                return 1;
            } else {
                return 0;
            }
        }
        let mut prev_xs:BTreeMap<usize,usize> = BTreeMap::new();
        for (y,chr1) in t.chars().enumerate(){
            let mut new_xs:BTreeMap<usize,usize> = BTreeMap::new();
            for (x,chr2) in s.chars().enumerate(){
                if chr1==chr2{
                    if y==0{
                        *new_xs.entry(x).or_insert(0)+=1;
                    } else {
                        for (key,val) in prev_xs.range(..x){
                            *new_xs.entry(x).or_insert(0)+=val;
                        }
                    }
                }
            }
            prev_xs = new_xs;
        }
        prev_xs.into_iter().map(|(k,v)| v).sum::<usize>() as i32
    }
}