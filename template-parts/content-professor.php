<div class="post-item">
    <li class="professor-card__list-item">
        <!-- <h2 class="headline headline--medium"><?php the_title(); ?></h2> -->
        <a class="professor-card" href="<?php the_permalink(); ?>">
        <img class="professor-card__image" src="<?php the_post_thumbnail_url('professorLandscape') ?>">
        <span class="professor-card__name"><?php the_title(); ?></span>
        </a>
    </li>
</div>
