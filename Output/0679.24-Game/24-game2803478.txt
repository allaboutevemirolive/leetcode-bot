// https://leetcode.com/problems/24-game/solutions/2803478/rust-recursion-permutation/
impl Solution {
    pub fn judge_point24(cards: Vec<i32>) -> bool {
        let mut cards = cards;
        cards.sort();
        
        loop {
        if Self::check(&cards) { return true }
            if Self::next_permutation(&mut cards) == false { break }
        }
        
        false
    }
    
    fn check(cards: &Vec<i32>) -> bool {
        let mut cards = cards.iter().map(|a| *a as f64).collect();
        Self::solve(&cards)
    }
    
    
    fn next_permutation(data: &mut Vec<i32>) -> bool {
        let n = data.len();
        let mut i = n - 1;
        
        while i > 0 && data[i - 1] >= data[i] { i -= 1; }
        if i == 0 { return false }
        
        let mut k = n - 1;
        while data[k] <= data[i - 1] { k -= 1; }
        data.swap(i - 1, k);
        let (mut left, mut right) = (i, n - 1);
        while left < right {
            data.swap(left, right);
            left += 1;
            right -= 1;
        }
        
        true
    }
    
    
    fn solve(cards: &Vec<f64>) -> bool {
        if cards.len() == 1 {
            return f64::abs(cards[0] - 24f64) < 0.000001 
        }
        
        for k in 0 .. cards.len() - 1 {
            let values = Self::types(cards[k], cards[k + 1]);
            let mut temp = cards.clone();
            temp.remove(k + 1);
            for a in values {
                temp[k] = a;
                if Self::solve(&temp) { return true }
            }
        }
        
        false
    }
    
    fn types(a: f64, b: f64) -> Vec<f64> {
        let mut ret = vec![a - b, a + b, a * b];
        if b != 0f64 { ret.push(a / b); }
        ret
    }
}