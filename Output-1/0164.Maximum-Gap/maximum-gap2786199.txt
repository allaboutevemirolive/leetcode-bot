// https://leetcode.com/problems/maximum-gap/solutions/2786199/rust-radix-sort-faster-than-100/
const RADIX : usize = 256;

pub trait RadixSort {
    fn radix_sort(&mut self);
    fn u32_sorting_routine(arr : &mut [u32], len : usize, mut max_ele : u32) {

        let mut exp : u8 = 0;
       
        while max_ele > 0 {
            let mut count : [usize; RADIX] = [0; RADIX];
            let mut temp  : Vec<u32> = vec![0; len];
            arr.iter()
                .for_each(|&x| count[(x >> (exp << 3)) as usize & (RADIX - 1)] += 1);//counting each digit

            count [0] = count[0].wrapping_sub(1);//reducing count[0] by 1 so that we get 0-based index after prefix-sum or rolling sum of the array

            for i in 1..RADIX {
                count[i] = count[i].wrapping_add(count[i - 1]);//performing the prefix-sum or rolling sum of the array
            }

            (0..len).rev().for_each(|i| {
                let idx = &mut count[(arr[i] >> (exp << 3)) as usize & (RADIX - 1)];
                temp[*idx] = arr[i];
                if *idx > 0 {
                    *idx -= 1
                };
            });

            arr.copy_from_slice(&temp);
            max_ele = max_ele.wrapping_shr(8);
            exp += 1;
        }
    }
}
impl RadixSort for Vec<u32> {
    fn radix_sort(&mut self){
        let len = self.len();
        let max_ele = *self.iter().max().unwrap();

        Self::u32_sorting_routine(self, len, max_ele);
    }
}

impl Solution {
    pub fn maximum_gap(nums: Vec<i32>) -> i32 {
        let mut nums : Vec<u32> = nums.into_iter().map(|num| num as u32).collect();
        nums.radix_sort();
        nums.windows(2).map(|window| window[1] - window[0]).max().unwrap_or(0) as i32
    }
}