// https://leetcode.com/problems/candy/solutions/1436162/rust-divide-and-conquer/
fn _backprop(ratings: &[i32], inc: u32, left: bool, candies: &mut [u32], level: u8) {
    if left {
        candies[0] += inc;
        for i in 0..ratings.len()-1 {
            if ratings[i] < ratings[i+1] && candies[i] >= candies[i+1] {
                candies[i+1] = candies[i] + 1;
            } else {
                break;
            }
        }
    } else {
        candies[candies.len()-1] += inc;
        for i in (1..ratings.len()).rev() {
            if ratings[i] < ratings[i-1] && candies[i] >= candies[i-1] {
                candies[i-1] = candies[i] + 1;
            } else {
                break;
            }
        }
    }
}

fn _candy(ratings: &[i32], level: u8) -> Vec<u32> {
    let mut result = vec![];
    
    if ratings.len() == 1 {
        result.push(1);
    } else {
        let middle = ratings.len() / 2;
        let mut left = _candy(&ratings[..middle], level+1);
        let mut right = _candy(&ratings[middle..], level+1);
        if ratings[middle-1] > ratings[middle] {
            // last of left group must have more than the first of right group
            if left[left.len()-1] <= right[0] {
                let inc = right[0] + 1 - left[left.len()-1];
                _backprop(&ratings[..middle], inc, false, &mut left, level);
            }
        } else if ratings[middle-1] < ratings[middle] {
            // last of left group must have less than the first of right group
            if left[left.len()-1] >= right[0] {
                let inc = left[left.len()-1] + 1 - right[0];
                _backprop(&ratings[middle..], inc, true, &mut right, level);
            }
        }
        
        left.append(&mut right);
        result = left;
    }
    
    result
}

impl Solution {
    pub fn candy(ratings: Vec<i32>) -> i32 {
        _candy(&ratings, 0).iter().sum::<u32>() as i32
    }
}