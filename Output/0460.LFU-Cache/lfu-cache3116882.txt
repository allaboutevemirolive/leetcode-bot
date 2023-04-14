// https://leetcode.com/problems/lfu-cache/solutions/3116882/rust-o-1-put-get-beats-96/
use std::collections::HashMap;

type MapKey    = i32;
type FreqCount = i32;
type FreqTable = LinkedTable<(FreqCount, LinkedTable<MapKey>)>;

#[derive(Clone)]
struct MapRecord {
    value  : i32,
    hfreq : HLTNode,  // Handle to the key's current frequency queue.
    hqpos : HLTNode,  // Handle to the key's position in the queue.
}
impl MapRecord {
    fn new(value: i32) -> Self {
        Self {
            value,
            hfreq : HLTNode::default(),
            hqpos : HLTNode::default(),
        }
    }
}

pub struct LFUCache {
    map    : HashMap<i32, MapRecord>,
    freqs  : FreqTable,
    cap    : usize,
}
impl LFUCache {
    pub fn new(capacity: i32) -> Self {
        Self {
            map    : HashMap::new(),
            freqs  : LinkedTable::new(),
            cap    : capacity as usize,
        }
    }
    /// Get the value for `key` if it exists, else return -1.
    /// 
    pub fn get(&mut self, key: i32) -> i32 {
        if let Some(mut record) = self.map.get_mut(&key) {
            Self::move_to_next_queue(&mut self.freqs, key, record);
            record.value as i32
        } else {
            -1
        }
    }
    /// Insert a new key-value pair into the cache. If the cache is at capacity,
    /// delete the least frequently used key before inserting the new key.
    /// 
    pub fn put(&mut self, key: i32, value: i32) {
        if let Some(mut record) = self.map.get_mut(&key) {
            // If the record exists in the map, we don't delete any keys.
            record.value = value;
            Self::move_to_next_queue(&mut self.freqs, key, record);
        } else if self.cap > 0 { 
            // New key incoming. Delete the LFU key if cache is full.
            if self.map.len() >= self.cap {
                Self::delete_lfu(&mut self.map, &mut self.freqs);
            }
            // Insert new key.
            let hfirstq = Self::get_next_queue(&mut self.freqs, None);
            let hqpos   = self.freqs.get_mut(hfirstq)
                                    .unwrap().1
                                    .push_back(key);
            let mut new_rec = MapRecord::new(value);
            new_rec.hfreq = hfirstq;
            new_rec.hqpos = hqpos;
            self.map.insert(key, new_rec);
        }
    }
    /// Removes the least frequently used key.
    /// 
    fn delete_lfu(map   : &mut HashMap<i32, MapRecord>, 
                  freqs : &mut FreqTable) 
    {
        // Select and delete the least frequently used key.
        if let Some(hfirst_freq) = freqs.first_node() {
            let first_freq = freqs.get_mut(hfirst_freq).unwrap();
            
            if let Some(key) = first_freq.1.pop_front() {
                map.remove(&key);

                // Remove the old queue if it is empty, and not freq = 1.
                if first_freq.0 != 1 && freqs[hfirst_freq].1.len() == 0 {
                    freqs.remove(hfirst_freq);
                }
            }
        }
    }
    /// Move the key to the next frequency queue, i.e., If the key is currently
    /// in queue 1, then it will be moved to queue 2.
    /// 
    fn move_to_next_queue(freqs  : &mut FreqTable, 
                          key    : i32, 
                          record : &mut MapRecord) 
    {
        let hfreq = record.hfreq;
        let hqpos = record.hqpos;

        freqs[hfreq].1.remove(hqpos);

        let next_hfreq = Self::get_next_queue(freqs, Some(hfreq));

        record.hfreq = next_hfreq;
        record.hqpos = freqs[next_hfreq].1.push_back(key);

        // Remove the old queue if it is empty.
        if freqs[hfreq].1.len() == 0 {
            freqs.remove(hfreq);
        }
    }
    /// Get the frequency queue that comes immediately after the queue 
    /// indicated by the handle, `hfreq`. if `hfreq` is `None`, then get the
    /// first queue in the frequency table (frequency = 1).
    ///
    fn get_next_queue(freqs : &mut FreqTable, 
                      hfreq : Option<HLTNode>) 
        -> HLTNode 
    {
        if let Some(hfreq) = hfreq {
            let freq    = freqs[hfreq].0;
            let is_next = |t: &(_, _)| t.0 == freq + 1;
            match freqs.get_next(hfreq) {
                Some(hfreq_next) if freqs.get(hfreq_next).map_or(false, is_next)
                  => hfreq_next,
                _ => freqs.insert_after(hfreq, (freq + 1, LinkedTable::new())),
            }
        } else {
            match freqs.first_node() {
                Some(hfirstq) if freqs.get(hfirstq).map_or(false, |t| t.0 == 1) 
                  => hfirstq,
                _ => freqs.push_front((1, LinkedTable::new()))
            }
        }
    }
}

use std::collections::LinkedList;
use std::ops::{Index, IndexMut};

const BAD_HANDLE : HLTNode = HLTNode(usize::MAX);

/// Release build version of the handle type for the linked table nodes.
/// 
#[repr(transparent)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct HLTNode(usize);

/// The node type that populates the linked table. Each node contains a value
/// and a handle to the previous and next nodes in the table.
/// 
#[derive(Debug, Clone, Copy)]
pub struct LTNode<T> {
    value : Option<T>,
    prev  : HLTNode,
    next  : HLTNode,
}

/// The linked table type. This is a doubly linked list that uses handles to
/// reference nodes. This allows for O(1) removal of nodes from the list.
/// 
#[derive(Debug)]
pub struct LinkedTable<T> {
    table   : Vec<LTNode<T>>,
    head    : HLTNode,
    recycle : LinkedList<HLTNode>,
    len     : usize,
}

impl<T> LinkedTable<T> {
    pub fn new() -> Self {
        let mut lt = Self {
            table   : Vec::new(),
            head    : BAD_HANDLE,
            recycle : LinkedList::new(),
            len     : 0,
        };
        lt
    }
    /// Returns the number of items in the table.
    /// 
    pub fn len(&self) -> usize {
        self.len
    }
    /// Returns true if the table is empty.
    /// 
    pub fn first(&self) -> Option<&T> {
        if self.is_empty() {
            None
        } else {
            self.get(self.head)
        }
    }
    /// Returns a mutable reference to the value of the first item in the table.
    /// 
    pub fn first_mut(&mut self) -> Option<&mut T> {
        if self.is_empty() {
            None
        } else {
            self.get_mut(self.head)
        }
    }
    /// Returns a handle to the first item in the table.
    /// 
    pub fn first_node(&self) -> Option<HLTNode> {
        if self.is_empty() {
            None
        } else {
            Some(self.head)
        }
    }
    /// Indicates whether the table is empty or not.
    /// 
    pub fn is_empty(&self) -> bool {
        self.head == BAD_HANDLE
    }
    /// Pushes the value onto the back of the table and returns its node handle.
    /// 
    pub fn push_back(&mut self, value: T) -> HLTNode {
        let node = self.new_node(Some(value));
        if self.is_empty() {
            self.head = node;
            self.iget_mut(node).prev = node;
        } else {
            let last = self.iget(self.head).prev;
            self.iget_mut(last).next = node;
            self.iget_mut(node).prev = last;
            self.iget_mut(self.head).prev = node;
        }
        self.len += 1;
        node
    }
    /// Pushes the value onto the front of the table and returns its node 
    /// handle.
    /// 
    pub fn push_front(&mut self, value: T) -> HLTNode {
        let node = self.new_node(Some(value));
        if self.is_empty() {
            self.head = node;
            self.iget_mut(node).prev = node;
        } else {
            let head = self.head;
            let prev = self.iget(head).prev;
            self.iget_mut(node).next = head;
            self.iget_mut(node).prev = prev;
            self.iget_mut(head).prev = node;
            self.head = node;
        }
        self.len += 1;
        node
    }
    /// Removes the first item from the front of the table and returns it.
    /// 
    pub fn pop_front(&mut self) -> Option<T> {
        if self.is_empty() {
            None
        } else {
            self.remove(self.head)
        }
    }
    /// Removes the item "pointed to" by the handle and returns it.
    /// 
    pub fn remove(&mut self, handle: HLTNode) -> Option<T> {
        if self.len == 1 {
            self.head = BAD_HANDLE;
        } else {
            let next = self.iget(handle).next;
            let prev = self.iget(handle).prev;
            if handle == self.head {
                self.head = next;
            } else {
                self.iget_mut(prev).next = next;
            }
            if next == BAD_HANDLE {
                self.iget_mut(self.head).prev = prev;
            } else {
                self.iget_mut(next).prev = prev;
            }
        }
        self.len -= 1;
        self.free_node(handle);
        self.iget_mut(handle).value.take()
    }
    /// Returns a reference to the value "pointed to" by the handle.
    /// 
    pub fn get(&self, handle: HLTNode) -> Option<&T> {
        self.iget(handle).value.as_ref()
    }
    /// Returns a mutable reference to the value "pointed to" by the handle.
    /// 
    pub fn get_mut(&mut self, handle: HLTNode) -> Option<&mut T> {
        self.iget_mut(handle).value.as_mut()
    }
    /// Returns a handle to the item after the one "pointed to" by `handle`.
    /// 
    pub fn get_next(&self, handle: HLTNode) -> Option<HLTNode> {
        let next = self.iget(handle).next;
        if next != BAD_HANDLE {
            Some(next)
        } else { 
            None 
        }
    }
    /// Inserts the value after the item "pointed to" by `handle` and returns
    /// the handle to the new item.
    /// 
    pub fn insert_after(&mut self, handle: HLTNode, value: T) -> HLTNode {
        let mut hnew = self.new_node(Some(value));
        let     next = self.iget(handle).next;
        self.iget_mut(hnew).next = next;
        if next != BAD_HANDLE {
            self.iget_mut(next).prev = hnew;
        } else {
            self.iget_mut(self.head).prev = hnew;
        }
        self.iget_mut(hnew).prev = handle;
        self.iget_mut(handle).next = hnew;
        self.len += 1;
        hnew
    }
    /// Inserts the value before the item "pointed to" by `handle` and returns
    /// the handle to the new node.
    /// 
    pub fn insert_before(&mut self, handle: HLTNode, value: T) -> HLTNode {
        let mut hnew = self.new_node(Some(value));
        let     prev = self.iget(handle).prev;
        self.iget_mut(hnew).prev = prev;
        self.iget_mut(hnew).next = handle;
        self.iget_mut(handle).prev = hnew;
        if handle == self.head {
            self.head = hnew;
        } else {
            self.iget_mut(prev).next = hnew;
        }
        self.len += 1;
        hnew
    }
    /// Returns a reference to the node associated with the handle.
    /// 
    #[inline]
    fn iget(&self, handle: HLTNode) -> &LTNode<T> {
        &self.table[handle.0]
    }
    /// Returns a mutable reference to the node associated with the handle.
    /// 
    #[inline]
    fn iget_mut(&mut self, handle: HLTNode) -> &mut LTNode<T> {
        &mut self.table[handle.0]
    }
    #[inline]
    fn is_valid(&self, handle: HLTNode) -> bool {
        self.iget(handle).prev != BAD_HANDLE
    }
    /// Returns a new node with the given value.
    /// 
    fn new_node(&mut self, value: Option<T>) -> HLTNode {
        if let Some(node) = self.recycle.pop_front() {
            self.iget_mut(node).value = value;
            node
        } else {
            self.table.push(LTNode {value, 
                                    prev  : BAD_HANDLE, 
                                    next  : BAD_HANDLE });
            HLTNode(self.table.len() - 1)
        }
    }
    /// Puts the handle in the recycling list. The node it references neets to
    /// be unlinked before calling this.
    /// 
    fn free_node(&mut self, handle: HLTNode) {
        self.iget_mut(handle).next = BAD_HANDLE;
        self.iget_mut(handle).prev = BAD_HANDLE;
        self.recycle.push_front(handle);
    }
}
impl<T> Index<HLTNode> for LinkedTable<T> {
    type Output = T;
    fn index(&self, handle: HLTNode) -> &T {
        self.get(handle).unwrap()
    }
}

impl<T> IndexMut<HLTNode> for LinkedTable<T> {
    fn index_mut(&mut self, handle: HLTNode) -> &mut T {
        self.get_mut(handle).unwrap()
    }
}

impl Default for HLTNode {
    fn default() -> Self {
        BAD_HANDLE
    }
}