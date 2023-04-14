// https://leetcode.com/problems/candy/solutions/2237592/rust-o-n-w-explanation/
pub fn candy(ratings: Vec<i32>) -> i32 {
        let mut candies = vec![1; ratings.len()];
        // apply the left neighbor rule
        for i in 1..ratings.len() {
            if ratings[i] > ratings[i - 1] {
                candies[i] = candies[i - 1] + 1;
            }
            // if ratings[i] <= ratings[i - 1] the left neighbor rule
            // allows for the current value of 1 to remain as the minimum
        }
        // the last child has no right neighbor to consider so the number
        // of candies given the child after applying the left neighbor rule
        // will not change once right neighbor rules are applied.
        // so the range for iterating in reverse does not include the last value 
        for i in (0..ratings.len() - 1).into_iter().rev() {
            if ratings[i] > ratings[i + 1] {
                // candies[i] might already be > candies[i + 1] + 1
                // because of previous application of left neighbor rule.
                // in order to satisfy both left and right neighbor rules
                // compare current candies[i] and candies[i + 1] + 1 and 
                // use the greater value
                candies[i] = candies[i].max(candies[i + 1] + 1)
            }
        }
        candies.iter().sum()
    }