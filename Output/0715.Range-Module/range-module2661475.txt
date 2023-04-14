// https://leetcode.com/problems/range-module/solutions/2661475/rust-btreemap-with-comments/
use std::collections::BTreeMap;

#[derive(Debug)]
struct RangeModule {
    // [start, end)
    tree: BTreeMap<i32, i32>,
}

impl RangeModule {
    fn new() -> Self {
        Self {
            tree: BTreeMap::new(),
        }
    }

    fn add_range(&mut self, left: i32, right: i32) {
        let (mut start, mut end) = (left, right);

        // Remove partially overlapping ranges to the left of "left"
        while let Some((&s, &e)) = self.tree.range(..=left).next_back() {
            // If the current range ends before this one starts, then we can
            // skip the rest, as they ar further to the left and will not overlap
            if e < left {
                break;
            }

            start = start.min(s);
            end = end.max(e);
            self.tree.remove(&s);
        }

        // Remove partially overlapping ranges to the right of "left"
        while let Some((&s, &e)) = self.tree.range(left..=right).next() {
            // If the current range starts after this one ends, then we can
            // skip the rest, as they ar further to the right and will not overlap
            if s > right {
                break;
            }

            //start = start.min(s);
            end = end.max(e);
            self.tree.remove(&s);
        }

        // either insert the merged ranges, or this one if there is no overlap
        self.tree.insert(start, end);
    }

    fn query_range(&self, left: i32, right: i32) -> bool {
        if let Some((_s, &e)) = self.tree.range(..=left).next_back() {
            // Because we've queried for ranges that start before LEFT, 
            // then we only have to check if this range is contained in the 
            // last returned range
            return e >= right;
        }

        false
    }

    fn remove_range(&mut self, left: i32, right: i32) {
        // If there is a range that starts before this one, check if they overlap
        // and if they do -> truncate the overlapping range.
        // Also handle the case if the range to remove is completely contained in the other range
        // In that case we have to split it in two
        if let Some((&s, &e)) = self.tree.range(..left).next_back() {
            if e > left {
                self.tree.remove(&s);
                self.tree.insert(s, left);
                if e > right {
                    self.tree.insert(right, e);
                }
            }
        }

        // remove all ranges that are completely within the [left; right) range
        while let Some((&s, &e)) = self.tree.range(left..right).next() {
            if e > right {
                break;
            }

            self.tree.remove(&s);
        }

        // Check if there is a partial overlap to the right and truncate the range if there is
        if let Some((&s, &e)) = self.tree.range(left..right).next() {
            self.tree.remove(&s);
            self.tree.insert(right, e);
        }
    }
}