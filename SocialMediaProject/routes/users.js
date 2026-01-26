const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async (req, res) => {
  if (req.body.userId=== req.params.id) {
    try {
      // تشفير الباسورد لو موجود
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      // تحديث بيانات المستخدم
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true,runValidators: true }
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
});











//deleteUser 






router.delete("/:id", async (req, res) => {
  if (req.body.userId=== req.params.id) {
    try {
     const user = await User.findByIdAndDelete(req.params.id);
     res.status(200).json("Acoount has beed deleted");
     

      
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account");
  }
});



// get a user




router.get("/:id", async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    res.status(200).json(user);

  }catch(err){
    res.status(500).json(err);
  }
})







router.put("/:id/follow", async (req, res) => {
  // تصحيح: كانت userIb وخليتها userId عشان تطابق الـ Body
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        // تصحيح: شلت التكرار في كلمة $push وقفلنا الأقواس صح
        await currentUser.updateOne({ $push: { followings: req.params.id } }); 
        
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});











router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      // التعديل هنا: بنشوف لو الـ ID موجود فعلاً عشان نعرف نشيله
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } }); 
        
        // التعديل هنا: الرسالة لازم تكون unfollowed
        res.status(200).json("user has been unfollowed");
      } else {
        // التعديل هنا: لو هو أصلاً مش في القائمة
        res.status(403).json("you don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});














module.exports = router;
