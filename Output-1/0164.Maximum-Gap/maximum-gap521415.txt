// https://leetcode.com/problems/maximum-gap/solutions/521415/rust-bucket-sort/
impl Solution {
    // O(nlog(n))
    //  sort and one pass
    
    // O(n) bucket sort
    pub fn maximum_gap(nums: Vec<i32>) -> i32 {
        if nums.len() < 2 {
            return 0 as i32;
        }
        
        let max = *nums.iter().max().unwrap();
        let min = *nums.iter().min().unwrap();
        
        let bucket_size = std::cmp::max(1 as i32, (max - min) / nums.len() as i32);
        let bucket_count = (max - min) / bucket_size + 1;
        let mut buckets = vec![(None, None); bucket_count as usize]; // bucket(min_val, max_val)
        
        for n in &nums {
            let bucket_num = ((n - min) / bucket_size) as usize;
            let bucket = buckets[bucket_num];
            
            match bucket {
                (Some(a), Some(b)) => {
                    if n < a {
                        buckets[bucket_num] = (Some(n), Some(b))
                    } else if n > b {
                        buckets[bucket_num] = (Some(a), Some(n))
                    }
                }
                
                (None, None) => {
                    buckets[bucket_num] = (Some(n), Some(n));                  
                }
                
                _ => ()
            }
        }
        
        let mut res = 0;
        let mut prev_max = min;
        
        for bucket in buckets {
            if let (Some(a), Some(b)) = bucket {
                res = std::cmp::max(res, a - prev_max);
                prev_max = *b;
            }
        }
        
        res as i32
    }
}