var sqlite = require('./../lib/node-sqlite/sqlite');
var db = sqlite.Database();
var dbLocation = "./db/main.db";

/*
 * DB fixtures
 *	populates the database tables user, tasks and comment.
 *	table data will be somewhat consistent incase references are 
 *	setup, they will at least be satified by the content.
 *
 *	Intended to be run after createDatabase.js, on development systems.
 */



//this is not a real password, 
//it is the password of the fake users
var password = "thereismorethanoneofeverything"; 

// quotes from Meditations to be used as tasks
var tasks =	[["Begin the morning","Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial."],
		["Whatever this is that I am","Whatever this is that I am, it is a little flesh and breath, and the ruling part. Throw away thy books; no longer distract thyself: it is not allowed; but as if thou wast now dying, despise the flesh; it is blood and bones and a network, a contexture of nerves, veins, and arteries."],
		["All that is from the gods","All that is from the gods is full of Providence. That which is from fortune is not separated from nature or without an interweaving and involution with the things which are ordered by Providence."],
		["Remember how long","Remember how long thou hast been putting off these things, and how often thou hast received an opportunity from the gods, and yet dost not use it."],
		["Every moment think steadily","Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice; and to give thyself relief from all other thoughts. "],
		["Do wrong to thyself","Do wrong to thyself, do wrong to thyself, my soul; but thou wilt no longer have the opportunity of honouring thyself. Every man's life is sufficient."],
		["Do the things external","Do the things external which fall upon thee distract thee? Give thyself time to learn something new and good, and cease to be whirled around. But then thou must also avoid being carried about the other way."],
		["Through not observing","Through not observing what is in the mind of another a man has seldom been seen to be unhappy; but those who do not observe the movements of their own minds must of necessity be unhappy. "],
		["This thou must always bear in mind","This thou must always bear in mind, what is the nature of the whole, and what is my nature, and how this is related to that, and what kind of a part it is of what kind of a whole; and that there is no one who hinders thee from always doing and saying the things which are according to the nature of which thou art a part. "],
		["Theophrastus","Theophrastus, in his comparison of bad acts- such a comparison as one would make in accordance with the common notions of mankind- says, like a true philosopher, that the offences which are committed through desire are more blameable than those which are committed through anger."],
		["Since it is possible","Since it is possible that thou mayest depart from life this very moment, regulate every act and thought accordingly. But to go away from among men, if there are gods, is not a thing to be afraid of, for the gods will not involve thee in evil."],
		["How quickly all things disappear","How quickly all things disappear, in the universe the bodies themselves, but in time the remembrance of them; what is the nature of all sensible things, and particularly those which attract with the bait of pleasure or terrify by pain, or are noised abroad by vapoury fame."],
		["Nothing is more wretched","Nothing is more wretched than a man who traverses everything in a round, and pries into the things beneath the earth, as the poet says, and seeks by conjecture what is in the minds of his neighbours, without perceiving that it is sufficient to attend to the daemon within him, and to reverence it sincerely."],
		["Though thou shouldst be going","Though thou shouldst be going to live three thousand years, and as many times ten thousand years, still remember that no man loses any other life than this which he now lives, nor lives any other than this which he now loses. The longest and shortest are thus brought to the same."],
		["Remember that all is opinion","For what was said by the Cynic Monimus is manifest: and manifest too is the use of what was said, if a man receives what may be got out of it as far as it is true."],
		["The soul of man does violence","The soul of man does violence to itself, first of all, when it becomes an abscess and, as it were, a tumour on the universe, so far as it can. For to be vexed at anything which happens is a separation of ourselves from nature."],
		["Of human life the time is a point","Of human life the time is a point, and the substance is in a flux, and the perception dull, and the composition of the whole body subject to putrefaction, and the soul a whirl, and fortune hard to divine, and fame a thing devoid of judgement."],
		["We ught to consider","We ught to consider not only that our life is daily wasting away and a smaller part of it is left, but another thing also must be taken into the account, that if a man should live longer, it is quite uncertain whether the understanding will still continue sufficient."],
		["We ought to observe also","We ought to observe also that even the things which follow after the things which are produced according to nature contain something pleasing and attractive. For instance, when bread is baked some parts are split at the surface, and these parts which thus open, and have a certain fashion contrary to the purpose of the baker's art."],
		["Hippocrates after curing many diseases","Hippocrates after curing many diseases himself fell sick and died. The Chaldaei foretold the deaths of many, and then fate caught them too. Alexander, and Pompeius, and Caius Caesar, after so often completely destroying whole cities."],
		["Do not waste","Do not waste the remainder of thy life in thoughts about others, when thou dost not refer thy thoughts to some object of common utility."],
		["Labour not unwillingly","Labour not unwillingly, nor without regard to the common interest, nor without due consideration, nor with distraction; nor let studied ornament set off thy thoughts."],
		["If thou findest in human life","If thou findest in human life anything better than justice, truth, temperance, fortitude, and, in a word, anything better than thy own mind's self-satisfaction in the things which it enables thee to do according to right reason."],
		["Never value anything","Never value anything as profitable to thyself which shall compel thee to break thy promise, to lose thy self-respect, to hate any man, to suspect, to curse, to act the hypocrite, to desire anything which needs walls and curtains."],
		["In the mind","In the mind of one who is chastened and purified thou wilt find no corrupt matter, nor impurity, nor any sore skinned over."],
		["Reverence the faculty","Reverence the faculty which produces opinion. On this faculty it entirely depends whether there shall exist in thy ruling part any opinion inconsistent with nature and the constitution of the rational animal."],
		["Throwing away","Throwing away then all things, hold to these only which are few; and besides bear in mind that every man lives only this present time, which is an indivisible point, and that all the rest of his life is either past or it is uncertain."],
		["To the aids","To the aids which have been mentioned let this one still be added:- Make for thyself a definition or description of the thing which is presented to thee, so as to see distinctly what kind of a thing it is in its substance."],
		["If thou workest","If thou workest at that which is before thee, following right reason seriously, vigorously, calmly, without allowing anything else to distract thee, but keeping thy divine part pure."],
		["As physicians have","As physicians have always their instruments and knives ready for cases which suddenly require their skill."],
		["No longer wander","No longer wander at hazard; for neither wilt thou read thy own memoirs, nor the acts of the ancient Romans and Hellenes, and the selections from books which thou wast reserving for thy old age."],
		["They know not","They know not how many things are signified by the words stealing, sowing, buying, keeping quiet, seeing what ought to be done; for this is not effected by the eyes, but by another kind of vision."],
		["Body, soul, intelligence","Body, soul, intelligence: to the body belong sensations, to the soul appetites, to the intelligence principles. To receive the impressions of forms by means of appearances belongs even to animals."],
		["Let no act be done","Let no act be done without a purpose, nor otherwise than according to the perfect principles of art."],
		["That which rules within","That which rules within, when it is according to nature, is so affected with respect to the events which happen, that it always easily adapts itself to that which is and is presented to it."],
		["Men seek retreats","Men seek retreats for themselves, houses in the country, sea-shores, and mountains; and thou too art wont to desire such things very much. But this is altogether a mark of the most common sort of men."],
		["This then remains","Remember to retire into this little territory of thy own, and above all do not distract or strain thyself, but be free, and look at things as a man, as a human being, as a citizen, as a mortal."],
		["If our intellectual part","If our intellectual part is common, the reason also, in respect of which we are rational beings, is common: if this is so, common also is the reason which commands us what to do, and what not to do."],
		["Death is such","Death is such as generation is, a mystery of nature; a composition out of the same elements, and a decomposition into the same; and altogether not a thing of which any man should be ashamed."],
		["It is natural","It is natural that these things should be done by such persons, it is a matter of necessity; and if a man will not have it so, he will not allow the fig-tree to have juice."],
		["Take away thy opinion","Take away thy opinion, and then there is taken away the complaint, 'I have been harmed.' Take away the complaint, 'I have been harmed,' and the harm is taken away."],
		["That which does","That which does not make a man worse than he was, also does not make his life worse, nor does it harm him either from without or from within."],
		["The nature","The nature of that which is universally useful has been compelled to do this."],
		["Consider that everything","Consider that everything which happens, happens justly, and if thou observest carefully, thou wilt find it to be so. I do not say only with respect to the continuity of the series of things, but with respect to what is just."],
		["Do not have such an opinion","Do not have such an opinion of things as he has who does thee wrong, or such as he wishes thee to have, but look at them as they are in truth."],
		["A man should","A man should always have these two rules in readiness; the one, to do only whatever the reason of the ruling and legislating faculty may suggest for the use of men; the other, to change thy opinion, if there is any one at hand who sets thee right and moves thee from any opinion."],
		["Hast thou reason","Hast thou reason? I have.- Why then dost not thou use it? For if this does its own work, what else dost thou wish?"],
		["Thou hast existed","Thou hast existed as a part. Thou shalt disappear in that which produced thee; but rather thou shalt be received back into its seminal principle by transmutation."],
		["Many grains","Many grains of frankincense on the same altar: one falls before, another falls after; but it makes no difference."],
		["Do not act","Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good."],
		["How much trouble","How much trouble he avoids who does not look to see what his neighbour says or does or thinks, but only to what he does himself, that it may be just and pure."],
		["He who has a vehement desire","He who has a vehement desire for posthumous fame does not consider that every one of those who remember him will himself also die very soon."],
		["Everything","Everything which is in any way beautiful is beautiful in itself, and terminates in itself, not having praise as part of itself. Neither worse then nor better is a thing made by being praised."]];

// list of user emails to be used with adding tasks and comments
var users = ['russell@domain.com', 'hilbert@domain.com', 'zermelo@domain.com', 
		'tarski@domain.com', 'zorn@domain.com', 
		'kripke@domain.com', 'quine@domain.com'];

// more quotes from Meditations, to be used as comments
var comments = 	["Think continually how many physicians are dead after often contracting their eyebrows over the sick",
		"Add to the reckoning all whom thou hast known, one after another.",
		"Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it. ",
		"For such a thing as this might have happened to every man; but every man would not have continued free from pain on such an occasion.",
		"It is a vulgar, but still a useful help towards contempt of death, to pass in review those who have tenaciously stuck to life.",
		"In he morning when thou risest unwillingly, let this thought be present- I am rising to the work of a human being.",
		"How easy it is to repel and to wipe away every impression which is troublesome or unsuitable, and immediately to be in all tranquility.",
		"Judge every word and deed which are according to nature to be fit for thee",
		"One man, when he has done a service to another, is ready to set it down to his account as a favour conferred. Another is not ready to do this, but still in his own mind he thinks of the man as his debtor, and he knows what he has done.",
		"A prayer of the Athenians: Rain, rain, O dear Zeus, down on the ploughed fields of the Athenians and on the plains.",
		"Be not disgusted, nor discouraged, nor dissatisfied, if thou dost not succeed in doing everything according to right principles.",
		"Remember that philosophy requires only the things which thy nature requires; but thou wouldst have something else which is not according to nature.",
		"Things are in such a kind of envelopment that they have seemed to philosophers, not a few nor those common philosophers, altogether unintelligible; nay even to the Stoics themselves they seem difficult to understand.",
		"The one, that nothing will happen to me which is not conformable to the nature of the universe; and the other, that it is in my power never to act contrary to my god and daemon: for there is no man who will compel me to this. ",
		"On every occasion I must ask myself this question, and inquire, what have I now in this part of me which they call the ruling principle?",
		"None of these things ought to be called a man's, which do not belong to a man, as man.",
		"Besides, if any of these things did belong to man, it would not be right for a man to despise them and to set himself against them; nor would a man be worthy of praise who showed that he did not want these things.",
		"To seek what is impossible is madness: and it is impossible that the bad should not do something of this kind.",
		"Nothing happens to any man which he is not formed by nature to bear.",
		"Things themselves touch not the soul, not in the least degree; nor have they admission to the soul, nor can they turn or move the soul.",
		"Reverence that which is best in the universe; and this is that which makes use of all things and directs all things.",
		"That which does no harm to the state, does no harm to the citizen.",
		"Often think of the rapidity with which things pass by and disappear, both the things which are and the things which are produced.",
		"Does another do me wrong? Let him look to it. He has his own disposition, his own activity.",
		"Let the part of thy soul which leads and governs be undisturbed by the movements in the flesh, whether of pleasure or of pain; and let it not unite with them, but let it circumscribe itself and limit those affects to their parts.",
		"Live with the gods. And he does live with the gods who constantly shows to them, his own soul is satisfied with that which is assigned to him.",
		"The house is smoky, and I quit it.",
		"As thou intendest to live when thou art gone out,...so it is in thy power to live here.",
		"Why do unskilled and ignorant souls disturb him who has skill and knowledge?",
		"Soon, very soon, thou wilt be ashes, or a skeleton, and either a name or not even a name; but name is sound and echo.",
		"Thou canst pass thy life in an equable flow of happiness, if thou canst go by the right way, and think and act in the right way.",
		"Do not be carried along inconsiderately by the appearance of things.",
		"They are objects of great concern to these people- wilt thou too then be made a fool for these things?",
		"Fortunate means that a man has assigned to himself a good fortune: and a good fortune is good disposition of the soul, good emotions, good actions."];


db.open(dbLocation, function (error) {
	if(error) {
		console.log(error);
		throw error;
	} else {
		// inserts all users
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('russell@domain.com','Russell',?)",
			[password],function (error) { console.log(error); });
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('hilbert@domain.com','Hilbert',?)",
			[password],function (error) { console.log(error); });
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('zermelo@domain.com','Zermelo',?)",
			[password],function (error) { console.log(error); });
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('tarski@domain.com','Tarski',?)",
			[password],function (error) { console.log(error); });
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('zorn@domain.com','Zorn',?)",
			[password],function (error) { console.log(error); });
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('kripke@domain.com','Kripke',?)",
			[password],function (error) { console.log(error); });
		db.execute("INSERT INTO user (email, nickname,password) "
				+"VALUES ('quine@domain.com','Quine',?)",
			[password],function (error) { console.log(error); });

		//inserts tasks
		for (i = 0; i < tasks.length; i++) {
			// sets priority, status, and date
			tasks[i][2] = "Low";
			tasks[i][3] = "Closed";
			// assigned user is chosen randomly
			tasks[i][4] = users[Math.floor(Math.random()*users.length)];
			tasks[i][5] = new Date().toString();
			db.execute("INSERT INTO task (taskName,"
				+"description,priority,status," 
				+"user,date) VALUES (?,?,?,?,?,?)", tasks[i],
				function(error){ if (error) console.log(error);}
			);
		}

		//inserts functions
		for (i = 0; i < comments.length; i++) {
			comment = [];
			comment[0] = comments[i];
			// randomly chooses a task to comment on
			comment[1] = Math.floor(Math.random()*tasks.length) + 1;
			// randomly chooses a user to make the comment
			comment[2] = users[Math.floor(Math.random()*users.length)];
			db.execute("INSERT INTO comment (thecomment,"
				+"taskid,email) VALUES (?,?,?)", comment,
				function(error){ if (error) console.log(error);}
			);
		}
	}
});
