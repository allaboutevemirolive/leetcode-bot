// https://leetcode.com/problems/profitable-schemes/solutions/3273195/rust-memoization-recursion/
use std::collections::HashMap;

impl Solution {
    pub fn profitable_schemes(n: i32, min_profit: i32, group: Vec<i32>, profit: Vec<i32>) -> i32 {
        // A scheme is every single possible combination, st sum of the group <= n, and profit > minprofit
        // number of schemes =+ schemes with crime i + schemes without crime i

        let mut memos = HashMap::new();

        ((schemes(n, min_profit, 0 as usize, &group, &profit, &mut memos) % (1e9 as i64 + 7))) as i32
    }
}

pub fn schemes(n: i32, min_profit: i32, i: usize, group: &Vec<i32>, profit: &Vec<i32>, memos: &mut HashMap<(i32, i32, usize), i64>) -> i64 {
    if n < 0 { return 0 }
    if (i >= group.len()) {
        if (min_profit <= 0) {
            return 1;
        } else {
            return 0;
        }
    }

    let min_profit = if min_profit < 0 { 0 } else { min_profit };

    if let Some(memo) = memos.get(&(n, min_profit, i)) { return memo.clone() }

    let schemes_with = schemes(n - group[i], min_profit - profit[i], i + 1, group, profit, memos);
    let schemes_without = schemes(n, min_profit, i + 1, group, profit, memos);

    memos.insert((n, min_profit, i), schemes_with + schemes_without);

    (schemes_with + schemes_without) % (1e9 as i64 + 7)
}