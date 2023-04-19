// https://leetcode.com/problems/maximum-gap/solutions/548025/rust-clean-solution-buckets/
#[derive(Copy, Clone)]
struct Bucket {
    used: bool,
    min: i32,
    max: i32,
}

impl Bucket {
    fn new() -> Bucket {
        Bucket {
            used: false,
            min: std::i32::MAX,
            max: std::i32::MIN,
        }
    }

    fn update(&mut self, val: i32) {
        self.min = val.min(self.min);
        self.max = val.max(self.max);
        self.used = true;
    }
}

impl Solution {
    pub fn maximum_gap(nums: Vec<i32>) -> i32 {
        if nums.len() < 2 {
            return 0;
        }

        let buckets = create_buckets(&nums);
        calculate_buckets_gap(&buckets)
    }
}

fn create_buckets(nums: &Vec<i32>) -> Vec<Bucket> {
    let min = nums.iter().min().unwrap();
    let max = nums.iter().max().unwrap();

    let bucket_size = 1.max((max - min) as usize / (nums.len() - 1));
    let bucket_count = (max - min) as usize / bucket_size + 1;
    let mut buckets = vec![Bucket::new(); bucket_count];

    for num in nums.iter() {
        let bucket_ind = (num - min) as usize / bucket_size;
        buckets[bucket_ind].update(*num);
    }

    buckets.into_iter().filter(|bucket| bucket.used).collect()
}

fn calculate_buckets_gap(buckets: &Vec<Bucket>) -> i32 {
    if buckets.len() < 2 {
        return 0;
    }
    
    buckets
        .windows(2)
        .map(|slice| slice[1].min - slice[0].max)
        .max()
        .unwrap()
}