// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/solutions/2515184/rust-three-dp-solutions-with-comments/
use std::{collections::HashMap};

impl Solution {
    fn dfs(k: usize, prices: &[i32], invested: bool, n_trans: usize, day: usize, memo: &mut HashMap<(bool, usize, usize), i32>) -> i32 {
        if n_trans == k || day == prices.len() {
            0
        } else if let Some(profit) = memo.get(&(invested, n_trans, day)) {
            *profit
        } else {
            let rez = Self::dfs(k, prices, invested, n_trans, day + 1, memo).max( if invested { 
                prices[day] + Self::dfs(k, prices, !invested, n_trans + 1, day + 1, memo)
            } else { 
                -prices[day] + Self::dfs(k, prices, !invested, n_trans, day + 1, memo)
            });
            memo.insert((invested, n_trans, day), rez);
            rez
        }
    }

    pub fn max_profit(k: i32, prices: Vec<i32>) -> i32 {
        Self::dfs(k as _, &prices, false, 0, 0, &mut HashMap::new())
    }
}