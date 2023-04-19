// https://leetcode.com/problems/find-median-from-data-stream/solutions/488917/rust-20ms-10-9mb-beat-100/
use std::collections::BinaryHeap;

struct MedianFinder
{
    low: BinaryHeap<i32>,
    high: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder
{
    fn new() -> Self
    {
        Self {
            low: BinaryHeap::new(),
            high: BinaryHeap::new(),
        }
    }

    fn add_num(&mut self, num: i32)
    {
        match (self.low.peek(), self.high.peek())
        {
            (None, Some(_)) => self.high.push(Reverse(num)),
            (None, None) => self.low.push(num),

            (Some(_), Some(Reverse(h))) if num >= *h => self.high.push(Reverse(num)),
            (Some(_), Some(_)) => self.low.push(num),
            (Some(_), None) => self.low.push(num),
        };

        match self.low.len().cmp(&self.high.len())
        {
            Ordering::Greater =>
            {
                if let Some(l) = self.low.pop()
                {
                    self.high.push(Reverse(l));
                }
            }
            Ordering::Less =>
            {
                if let Some(Reverse(h)) = self.high.pop()
                {
                    self.low.push(h);
                }
            }
            Ordering::Equal =>
            {}
        }
    }

    fn find_median(&self) -> f64
    {
        match (self.low.peek(), self.high.peek())
        {
            (Some(left), Some(Reverse(right))) =>
            {
                if (self.low.len() + self.high.len()) % 2 == 0
                {
                    (left + right) as f64 / 2.0
                }
                else if self.low.len() > self.high.len()
                {
                    *left as f64
                }
                else
                {
                    *right as f64
                }
            }
            (Some(l), None) => *l as f64,
            (None, Some(Reverse(h))) => *h as f64,
            (None, None) => 0.0,
        }
    }
}