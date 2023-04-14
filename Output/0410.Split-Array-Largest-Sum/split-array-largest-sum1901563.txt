// https://leetcode.com/problems/split-array-largest-sum/solutions/1901563/rust-0ms-2-1-mb-annotated-binarysearch/
impl Solution {
    pub fn split_array(nums: Vec<i32>, m: i32) -> i32 {
        //  MaxNum and SumNum represent all possible solutions 
        //  STRATEGY: Split the array into m groups such that each group 
		// is less than the middle value or mid of MaxNum and SumNum
		
        let (mut l, mut r) = (*nums.iter().max().unwrap(), 
            nums.iter().sum::<i32>());
        let mut res = 0;
        while l < r {
        //  NO overflow protection 
        //  Say mid: 21
            let mut mid = (l + r) / 2;
            nums.iter().enumerate()
                .fold(
                    (0, 1), 
                    |(mut total_sum, mut num_solutions), (i, _)| { 
                        let mut curr_sum = total_sum + nums[i];
            //  if the curr_sum is less than the mid value we keep adding until it overflows the mid value
                        match curr_sum <= mid { 
                            true => total_sum += nums[i],
            //  num_solutions: num of times we reach the largest sum value ie  when curr > mid. 
			//  How many times did we exceeded mid=21, and where did it occur inside our list?
            
                            //  total_sum: set this to the curr num value = 10
                            _ => {
                                num_solutions +=1;
                                // it exceeded on num = 10
                                //  Set the total sum to 10
                                total_sum = nums[i];
                            }
                        }
            
                        // Bringing var outside fold
                        res = num_solutions;
                        //  Return both vars to satisfy complier 
                        (total_sum, num_solutions)
                });
            //  Everytime we reach total_sum = 10 from our loop, we move the 
            //   l forward 
            if res > m {
                l = mid + 1
            } else { 
                r = mid
            }             
        }
        l
    }
}