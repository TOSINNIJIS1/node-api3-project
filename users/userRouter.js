const express = require('express');

const router = express.Router();
const userDb = require(`./userDb.js`)
const postDb = require(`../posts/postDb`)

router.post('/', validateUser, (req, res) => {
  // do your magic!
  userDb.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not add user" });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  postDb.insert(req.body)
  .then(posted => {
    postDb.getById(posted.id)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "cannot retrieve newly made post", error
      })
    });
  })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Error creating new post", error
      })
    })
});

router.get('/', (req, res) => {
  // do your magic!
  userDb.get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    console.error("Error getting users", error);
    res.status(500).json({
      message: "Error adding users"
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  // do your magic!
  userDb.getById(id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(404).json({
      errorMessage: "User with that ID does not exist"
    })
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  userDb.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error retrieving the posts", error });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb.remove(req.params.id)
    .then(del => {
      res.status(200).json(del);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error deleting the user", error });
    });
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
	const response = req.body;
	postDb.update(id, response)
		.then(response => {
			res.status(201).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Could not update post' });
		});
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  userDb.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was an error" });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "Missing name" });
    }
  } else {
    res.status(400).json({ message: "Missing user data" });
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ message: "Missing post data" });
  }
}

module.exports = router;
