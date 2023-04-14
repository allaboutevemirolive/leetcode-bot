// https://leetcode.com/problems/lfu-cache/solutions/762404/dictionary-and-nested-linked-lists-in-rust/
use std::collections::*;

#[derive(Debug)]
struct LinkedListNode<T> {
    value: T,
    prev: *mut LinkedListNode<T>,
    next: *mut LinkedListNode<T>,
}

struct LinkedList<T> {
    head: *mut LinkedListNode<T>,
    tail: *mut LinkedListNode<T>,
}

impl<T> std::fmt::Debug for LinkedList<T>
where
    T: std::fmt::Debug,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[")?;
        let mut node_ptr = self.head;
        while let Some(node) = unsafe { node_ptr.as_ref() } {
            write!(f, "{:?},", node.value)?;
            node_ptr = node.next;
        }
        write!(f, "]")?;

        Ok(())
    }
}

impl<T> LinkedList<T> {
    pub fn new() -> LinkedList<T> {
        LinkedList {
            head: std::ptr::null_mut(),
            tail: std::ptr::null_mut(),
        }
    }

    pub fn is_empty(&self) -> bool {
        assert!(self.head.is_null() == self.tail.is_null());
        self.head.is_null()
    }

    fn insert_between(
        &mut self,
        prev: *mut LinkedListNode<T>,
        mut value: T,
        next: *mut LinkedListNode<T>,
    ) -> *mut LinkedListNode<T> {
        // Alloc memory and set value and prev and next pointers.
        let layout = std::alloc::Layout::new::<LinkedListNode<T>>();
        let node_ptr = unsafe { std::alloc::alloc(layout) as *mut LinkedListNode<T> };
        let node = unsafe { node_ptr.as_mut().unwrap() };
        node.prev = prev;
        node.next = next;
        // Don't set `node.value = value` directly, as that attempts to drop `node.value` which is uninitialized.
        let dst = &mut node.value as *mut T;
        unsafe { std::ptr::copy_nonoverlapping(&mut value as *mut T, dst, 1) };

        // Update prev and next nodes if they exist.
        if let Some(prev_node) = unsafe { prev.as_mut() } {
            prev_node.next = node_ptr;
        }
        if let Some(next_node) = unsafe { next.as_mut() } {
            next_node.prev = node_ptr;
        }

        // Update `self.head` and `self.tail`:
        if prev.is_null() {
            self.head = node_ptr;
        }
        if next.is_null() {
            self.tail = node_ptr;
        }

        node_ptr
    }

    pub fn insert_head(&mut self, value: T) -> *mut LinkedListNode<T> {
        self.insert_between(std::ptr::null_mut(), value, self.head)
    }

    pub fn insert_nxt(&mut self, node: &mut LinkedListNode<T>, value: T) {
        self.insert_between(node as *mut LinkedListNode<T>, value, node.next);
    }

    /// Removes `node` from the linked list. `node` must be a node in the linked list.
    pub fn remove(&mut self, node: &mut LinkedListNode<T>) -> T
    where
        T: Copy,
    {
        let node_ptr = node as *mut LinkedListNode<T>;
        // Fix prev and next pointers.
        if let Some(prev) = unsafe { node.prev.as_mut() } {
            prev.next = node.next;
        }
        if let Some(next) = unsafe { node.next.as_mut() } {
            next.prev = node.prev;
        }

        // Fix head and tail.
        if node_ptr == self.head {
            self.head = node.next;
        }
        if node_ptr == self.tail {
            self.tail = node.prev;
        }

        let t = (&mut node.value) as *mut T;
        // Drop the value.
        unsafe { t.drop_in_place() };
        // De-allocate the node.
        let value = node.value;
        let layout = std::alloc::Layout::new::<LinkedListNode<T>>();
        unsafe { std::alloc::dealloc(node as *mut LinkedListNode<T> as *mut u8, layout) };
        value
    }

    /// Removes `node` from the linked list. `node` must be a node in the linked list.
    pub fn remove_novalue(&mut self, node: &mut LinkedListNode<T>) {
        let node_ptr = node as *mut LinkedListNode<T>;
        // Fix prev and next pointers.
        if let Some(prev) = unsafe { node.prev.as_mut() } {
            prev.next = node.next;
        }
        if let Some(next) = unsafe { node.next.as_mut() } {
            next.prev = node.prev;
        }

        // Fix head and tail.
        if node_ptr == self.head {
            self.head = node.next;
        }
        if node_ptr == self.tail {
            self.tail = node.prev;
        }

        let t = (&mut node.value) as *mut T;
        // Drop the value.
        unsafe { t.drop_in_place() };
        // De-allocate the node.
        let layout = std::alloc::Layout::new::<LinkedListNode<T>>();
        unsafe { std::alloc::dealloc(node as *mut LinkedListNode<T> as *mut u8, layout) };
    }
}

impl<T> Drop for LinkedList<T> {
    fn drop(&mut self) {
        let mut node_ptr = self.head;
        while let Some(node) = unsafe { node_ptr.as_mut() } {
            let next_ptr = node.next;
            let t = (&mut node.value) as *mut T;
            // Drop the value.
            unsafe { t.drop_in_place() };
            let layout = std::alloc::Layout::new::<LinkedListNode<T>>();
            unsafe { std::alloc::dealloc(node_ptr as *mut u8, layout) };
            node_ptr = next_ptr;
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct KeyVal {
    key: i32,
    val: i32,
}

#[derive(Debug)]
struct LfuNode {
    count: usize,
    lru_ll: LinkedList<KeyVal>,
}

impl LfuNode {
    pub fn new(count: usize) -> LfuNode {
        LfuNode {
            count,
            lru_ll: LinkedList::new(),
        }
    }
}

struct LFUCache {
    lfu_ll: LinkedList<LfuNode>,
    key_to_links: HashMap<i32, (*mut LinkedListNode<LfuNode>, *mut LinkedListNode<KeyVal>)>,
    capacity: usize,
}

impl std::fmt::Debug for LFUCache {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        writeln!(f, "Lfu Cache State:")?;
        writeln!(f, "----------------")?;
        writeln!(f, "Capacity: {:?}", self.capacity)?;
        writeln!(f, "Lfu Linked List:")?;
        let mut cur_node_ptr = self.lfu_ll.head as *const LinkedListNode<LfuNode>;
        while let Some(cur_node) = unsafe { cur_node_ptr.as_ref() } {
            writeln!(f, "  {:?}", cur_node)?;
            cur_node_ptr = cur_node.next;
        }
        writeln!(f, "Key to links:")?;
        for (key, (lfu_node, lru_node)) in self.key_to_links.iter() {
            let lfu = unsafe { lfu_node.as_ref() };
            let lru = unsafe { lru_node.as_ref() };
            writeln!(f, "{:?}: {:?}, {:?}", key, lfu, lru)?;
        }

        Ok(())
    }
}

fn get_or_insert_next_lfu_node(
    lst: &mut LinkedList<LfuNode>,
    node: &mut LinkedListNode<LfuNode>,
) -> *mut LinkedListNode<LfuNode> {
    if node.next.is_null()
        || unsafe { node.next.as_ref().unwrap() }.value.count != 1 + node.value.count
    {
        lst.insert_nxt(node, LfuNode::new(node.value.count + 1));
    }

    node.next
}

impl LFUCache {
    fn new(capacity: i32) -> LFUCache {
        LFUCache {
            lfu_ll: LinkedList::new(),
            key_to_links: HashMap::new(),
            capacity: capacity as usize,
        }
    }

    fn _get(&mut self, key: i32) -> Option<&mut KeyVal> {
        // Get the two links for this key.
        let (lfu_ptr, lru_ptr) = self.key_to_links.get(&key)?;
        let lfu_node = unsafe { (*lfu_ptr).as_mut().unwrap() };
        let lru_node = unsafe { (*lru_ptr).as_mut().unwrap() };

        // Remove the lru node from the lru list and place the lru node in the next lfu bucket.
        let key_val = lfu_node.value.lru_ll.remove(lru_node);
        let next_lfu_node_ptr = get_or_insert_next_lfu_node(&mut self.lfu_ll, lfu_node);
        let next_lfu_node = unsafe { next_lfu_node_ptr.as_mut().unwrap() };
        if lfu_node.value.lru_ll.is_empty() {
            self.lfu_ll.remove_novalue(lfu_node);
        }

        let new_lru_node = next_lfu_node.value.lru_ll.insert_head(key_val);
        *self.key_to_links.get_mut(&key).unwrap() = (next_lfu_node_ptr, new_lru_node);

        Some(&mut unsafe { new_lru_node.as_mut().unwrap() }.value)
    }

    fn get(&mut self, key: i32) -> i32 {
        match self._get(key) {
            Some(key_val) => key_val.val,
            None => -1,
        }
    }

    fn put(&mut self, key: i32, val: i32) {
        if self.capacity == 0 {
            return;
        }

        if let Some(key_val) = self._get(key) {
            key_val.val = val;
            return;
        }

        assert!(self.key_to_links.len() <= self.capacity);
        if self.key_to_links.len() == self.capacity {
            let lru_ll = &mut unsafe { self.lfu_ll.head.as_mut().unwrap() }.value.lru_ll;
            let removed_keyval = lru_ll.remove(unsafe { lru_ll.tail.as_mut().unwrap() });
            self.key_to_links.remove(&removed_keyval.key).unwrap();
        }

        // Add new `keyval` to the lists and dictionary.
        let keyval = KeyVal { key, val };
        // Get the lfu node with count 1
        let lfu_head_ptr = self.lfu_ll.head;
        if lfu_head_ptr.is_null() || unsafe { lfu_head_ptr.as_ref().unwrap() }.value.count != 1 {
            self.lfu_ll.insert_head(LfuNode::new(1));
        }
        let lru_ll = &mut unsafe { self.lfu_ll.head.as_mut().unwrap() }.value.lru_ll;
        let lru_node = lru_ll.insert_head(keyval);

        self.key_to_links.insert(key, (self.lfu_ll.head, lru_node));
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_linked_list_() {
        let mut list = LinkedList::new();
        let three = list.insert_head(3);
        let two = list.insert_head(2);
        let one = list.insert_head(1);

        list.insert_nxt(unsafe { two.as_mut().unwrap() }, 42);
        println!("{:?}", list);

        assert_eq!(list.remove(unsafe { two.as_mut().unwrap() }), 2);
        assert_eq!(list.remove(unsafe { one.as_mut().unwrap() }), 1);
        assert_eq!(list.remove(unsafe { three.as_mut().unwrap() }), 3);
        println!("{:?}", list);
    }

    #[test]
    fn test_lfu_cache() {
        let mut lfu = LFUCache::new(2);
        assert_eq!(lfu.get(42), -1);

        lfu.put(5, 50);
        assert_eq!(lfu.get(5), 50);
        lfu.put(5, 51);
        assert_eq!(lfu.get(5), 51);

        lfu.put(4, 40);
        assert_eq!(lfu.get(4), 40);
        lfu.put(4, 41);
        assert_eq!(lfu.get(4), 41);

        // 4 and 5 have been used the same number of times, but 5 is least recent, and should be evicted.
        lfu.put(6, 60);
        assert_eq!(lfu.get(5), -1);
        assert_eq!(lfu.get(6), 60);

        // 4 has been used more than 6, so 6 is evicted.
        lfu.put(7, 70);
        assert_eq!(lfu.get(6), -1);
        assert_eq!(lfu.get(7), 70);

        println!("{:?}", lfu);
    }
}