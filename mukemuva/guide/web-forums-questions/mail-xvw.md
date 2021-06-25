
Bonjour et merci pour ta réponse très complète.

[ce mail est assez longn prends un peu de temps pour le liure....]

Je comprends les enjeux de la prograzmmation fonctionnelle mais je n'ai pas compris toute ta réponse. Notamment par le fait que je ne sais pas désigner ou dénommer les opérateurrs de monades (">==" et ">=>") ce qui me bloque un peu. Pour autant j'ai quelques restes de maths du BAC + 2, DEUG Sciences de la Matière...

Peut être pourrais tu m'aider dans mes petites recherches ?

Je peux en parler : je travaille toujours sur mon système de mots clés en nuage : j'ai même trouvé un mode de représentation compatible avec les usages du mobile, mais je garde cela pour une autre fois.

Pour l'instant je me concentre sur une structure de données stockant à la façon d'une hashmap des informations en vis à vis de clés multiples.

    var key_a = { w: -6, x: 1, y2: 2, z: 3 }
    var key_b = { w: -6, x: 3,  y2: 2, z: 1 }
    var key_c = { w: 8, x: -4, y: -4, z: 0 }

Ici j'ai choisi des points 4D tels que x + y +z + w === 0 mais c'est juste pour l'exercice. On crée 4 roles (x, y, z et w) en initialisant la structure :

    var mkbag = mulikeysbag.create(['x', 'y', 'z', 'w'])

    // = ou =

    var mkbag = multikeybag.create('x,y,z,w'.split(','))

Peut importe l'ordre des clés l'essentiel est que ce soit des chaînes de caractères identifiant des rôles de façon précises, comme dans une relation N-aire de SGBDR ou une base type IndexedDB.

Ensuite on peuple la structure :

    mkbag.set(key_a, 123)
    mkbag.set(key_b, '123')
    mkbag.set(key_c, { data: 123 })

On peut récupérer :

    mkbag.get(key_a)

Ou faire des requêtes, avec des jokers ou des filtres :

    mkbag.select({ w: -6, x: '*', y: '*', z: '*'}, collector)

    // = ou =

    mkbag.select({
        w: (val) => val === -6,
        x: (val) => val >= 1,
        y: (val) => val >= 2,
        z: (val) => val >= 3
    }, collector)

Ici les filtres de sélection (valeur, joker ou fonction) sont le premier paramètre de select; le second paramètre "collector" désignen un callback qui prend en paramètre la valeur d'un tuple (sac) de résultats ET la valeur de la donnée portée (payload e, anglais)

Dans un cas limite si il n'y a qu'un seul rpole, on a une implémentation de la Map de base, et si on en a deux, on obtient une table de jointure de base de données (cas de la relation many-to-many) l'avantage étant que la structure est "en vif"dans le programme car "mkbag"  est une variable ordinaire.

C'est la version à deux rôles "table d'association" qui m'intéresse pour les besoins de mon nuage sémantique.

J'ai fait une première implémentation en suivant ton conseil "pas de Map de Maps" et cela fonctionne.

Des remarques pêle-mêle : 

* la structure foncctionne d'après une combinaison astucieuse de tableaux (listes de blocs) et de Maps texte => UIDS de blocks) avec un générateur de clés pseudo aléatoires (PRNG Multiply-With-Carry dans mon cas;

* cela prends du temps quand la quantité de données croît : aussi j'aurais peut être bessoin de rendre la code asynchrone, sinon c'est bloquant;

* j'ai besoin de faire rapidemùent des intersections de plusieurs listes volumineuses de clés dans les opération de recheche : il faut optimiser tout cela...

Voilà où j'en suis dans mes développements.


