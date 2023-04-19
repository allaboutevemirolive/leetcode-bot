// https://leetcode.com/problems/candy/solutions/521309/rust-one-pass-solution/
impl Solution {
    pub fn candy(ratings: Vec<i32>) -> i32 {        
        let mut i = 1;
        let mut num = 0;
        let mut res = ratings.len();
        let mut last = 0;
        
        while i < ratings.len() {
            num = 0;
            let mut j = i;
            
            if ratings[i] == ratings[i-1] {
                while j < ratings.len() && ratings[j] == ratings[j-1] {
                    j += 1;
                }
            } else if ratings[i] > ratings[i-1] {
                while j < ratings.len() && ratings[j] > ratings[j-1] {
                    j += 1;
                    num += 1;
                    res += num;
                }
            } else {
                while j < ratings.len() && ratings[j] < ratings[j-1] {
                    j += 1;
                    res += num;
                    num += 1;
                }
                res -= last;
                res += std::cmp::max(last, num);
                num = 0;
            }
            
            last = num;
            i = j;
        }
                
        res as i32
    }
}