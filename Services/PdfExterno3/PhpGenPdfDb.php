<?php
namespace Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfBdPdo as BdPdo;
class PhpGenPdfDb {
    private static $instancia = "";
    public function __construct( $db) {  
        if (self::$instancia == "") {
            self::$instancia = new BdPdo($db->getConnection());
        }
    }
    /**
     * @return BdPdo
     */
    public static function getConexion($connName="") {
        return self::$instancia;
    }
}
?>